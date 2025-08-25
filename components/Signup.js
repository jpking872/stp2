import {useEffect, useState} from "react";
import axios from "axios";
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Utils from '../utils/functions';
import '../utils/global';
import dayjs from 'dayjs';
import * as React from "react";
import Calendar from './Calendar';
import SkateButton from './SkateButton';
import { CheckBox } from '@rneui/themed';

function Signup() {

    const currentDateTime = '2025-07-30 09:30:00';
    const [signupDate, setSignupDate] = useState(dayjs(currentDateTime).format('YYYY-MM-DD'));

    const [sessions, setSessions] = useState(null); // State to store fetched data
    const [registered, setRegistered] = useState([]); // State to store fetched data
    const [originalRegistered, setOriginalRegistered] = useState([]); // State to store fetched data
    const [pass, setPass] = useState(false);
    const [accountData, setAccountData] = useState({});
    const [balance, setBalance] = useState(0); // State to store fetched data
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling
    const [reload, setReload] = useState(false);

    //const skaterToken = Utils.getCookie('skaterToken') ?? null;
    const skaterToken = "80|cURzcQnctqsJzaoHg0cyqrey3uT1bUf7kyL8r9vZ49775fac";

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('http://skateapi.kingjonathan.com/api/freestyle/get/' + signupDate, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                const data = await response.json();
                setSessions(data);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();

        const fetchRegistered = async () => {
            try {
                const response = await fetch('http://skateapi.kingjonathan.com/api/freestyle/skater/' + signupDate, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                const data = await response.json();
                setRegistered(data.freestyles);
                setOriginalRegistered(data.freestyles);
                setPass(data.pass);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistered();

        const fetchAccountData = async () => {
            try {
                const response = await fetch('http://skateapi.kingjonathan.com/api/summary/account', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                const data = await response.json();
                setAccountData(data);
                setBalance(data.balance);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
        setReload(false);

    }, [signupDate, reload]);


    if (loading) {
        return <Text>Loading data...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    function isRegistered(i) {
        return registered.indexOf(sessions[i].id) !== -1;
    }

    function isOriginalRegistered(i) {
        return originalRegistered.indexOf(sessions[i].id) !== -1;
    }

    function clickedSkate(i) {
        const regIndex = registered.indexOf(sessions[i].id);
        const regCopy = registered.slice();
        const nf = accountData;
        if (regIndex !== -1) {
            regCopy.splice(regIndex, 1)
            setRegistered(regCopy);
            if (!pass) {
                nf.numFree -= 1;
                setBalance(balance + 1);
            } else {
                nf.numFree -= 1;
                nf.numFreePass -= 1;
            }
        } else {
            regCopy.push(sessions[i].id);
            setRegistered(regCopy);
            if (!pass) {
                nf.numFree += 1;
                setBalance(balance - 1);
            } else {
                nf.numFree += 1;
                nf.numFreePass += 1;
            }
        }
        setAccountData(nf);
    }

    function renderSkate(i) {

        const now = dayjs(currentDateTime);
        let sessionTime = dayjs(sessions[i].session_time);
        let regSessionTime = dayjs(sessions[i].session_time).add(30, 'minute');
        const passThisDay = false;
        let content;
        if (isOriginalRegistered(i) && now.isAfter(sessionTime)) {
            content = <MaterialIcons name="check" style={styles.darkColor} size={42} />
        } else if (sessions[i].count >= sessions[i].size || (accountData.balance < 0 && !passThisDay) || (!isRegistered(i) && now.isAfter(regSessionTime))) {
            content = <MaterialIcons name="clear" style={styles.lightColor} size={42} />
        } else {
            content = <TouchableOpacity onPress={() => clickedSkate(i)}>
                            <MaterialIcons name="ice-skating" style={isRegistered(i) ? styles.darkColor : styles.lightColor } size={42} />
                     </TouchableOpacity>
        }

        return (
            <>{content}</>
        )
    }

    function handleSignup() {
        if (balance < 0) {
            setMessage("Balance is too low");
            return;
        }
        setLoading(true);
        const response = async () => await axios.post(
            'http://skateapi.kingjonathan.com/api/freestyle/signup', {
                sessionDate: signupDate,
                signup: registered
            },
            {
                headers: {
                    Authorization: 'Bearer ' + skaterToken
                }
            }
        ).then(response => {
            setRegistered(response.data);
            setLoading(false);
            setReload(true)
        });
        response();
    }

    function ChangeDate(curdate) {
        console.log('change date ' + curdate);
        setSignupDate(curdate);
    }

    return (
        <View style={styles.container}>
            <View><MaterialIcons name="key" style={styles.green} size={32} /><Text style={styles.headerText}>Nick Riviera</Text></View>
            <Text style={styles.headerText}>{dayjs(signupDate).format('MMMM D, YYYY')}</Text>
            <ScrollView style={styles.sessionScroll}>
                {sessions && sessions.map((item, index) => (
                    <View style={styles.sessionRow} key={item.id}>
                        <View style={styles.skateIcon}>{renderSkate(index)}</View>
                        <Text style={styles.skateText}>{dayjs(item.session_time).format('h:mma')} to {dayjs(item.session_time).add(item.duration, 'minute').format('h:mma')} {item.name} ({item.size - item.count} of {item.size})</Text>
                    </View>
                ))}
            </ScrollView>
            <SkateButton title="Signup" onPress={handleSignup} />
            <View>
                <Text style={styles.accountText}>Freestyles: {accountData.numFree}({accountData.numFreePass}) |
                Classes: {accountData.numClasses} | Purchased: {accountData.adjustments}</Text>
                <Text style={ balance > 0 ? styles.accountText : [styles.error, styles.accountText] }>Balance: {balance}</Text>
            </View>
            <View>
                <Calendar onUpdate={(value) => ChangeDate(value)} />
            </View>
        </View>
    )
}

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            height: '100%',
            marginVertical: 10,
            marginHorizontal: 20,
        },
        sessionScroll: {
            marginVertical: 5
        },
        sessionRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'left'
        },
        skateIcon: {
            width: 40,
            height: 40,
            alignItems: 'left'
        },
        skateText: {
            fontSize: 16,
            paddingTop:7,
            marginTop:3,
            marginHorizontal:5,
            color: global.DARK_COLOR
        },
        item: {
            backgroundColor: global.BG_COLOR,
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16
        },
        title: {
            fontSize: 32,
        },
        highlight: {
            color: global.HIGHLIGHT
        },
        green: {
            color: global.GREEN
        },
        error: {
            color: global.ERROR
        },
        darkColor: {
            color: global.DARK_COLOR
        },
        lightColor: {
            color: global.LIGHT_COLOR
        },
        signupButton: {
            color:'#FFFFFF',
            backgroundColor: global.DARK_COLOR
        },
        accountText: {
            textAlign: 'center'
        },
        headerText: {
            fontSize: 16
        }
    });

export default Signup;