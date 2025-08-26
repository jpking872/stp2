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
import Loading from './Loading';

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
        return (
            <Loading />
        );
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
            content = <MaterialIcons name="check" style={styles.darkColor} size={45} />
        } else if (sessions[i].count >= sessions[i].size || (accountData.balance < 0 && !passThisDay) || (!isRegistered(i) && now.isAfter(regSessionTime))) {
            content = <MaterialIcons name="clear" style={styles.lightColor} size={45} />
        } else {
            content = <TouchableOpacity onPress={() => clickedSkate(i)}>
                            <MaterialIcons name="ice-skating" style={isRegistered(i) ? styles.darkColor : styles.lightColor } size={45} />
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
        setReload(true);
        setLoading(true);
        setSignupDate(curdate);
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>{pass ? <MaterialIcons name="key" style={styles.green} size={32} /> : <MaterialIcons name="ice-skating" style={styles.darkColor} size={32} />}
                <View style={styles.memberData}>
                    <Text style={styles.headerText}>Nick Riviera</Text>
                    <Text style={[styles.headerText, styles.member]}>Junior Freeskate</Text>
                </View>
                <View style={styles.memberData}>
                    <Text style={[styles.headerText, styles.highlight]}>{dayjs(signupDate).format('MMMM D, YYYY')}</Text>
                    <Text style={[styles.headerText, styles.member]}>Mar 2025</Text>
                </View>
            </View>
            <ScrollView style={styles.sessionScroll}>
                {sessions && sessions.map((item, index) => (
                    <View style={[styles.sessionRow, index % 2 === 0 ? styles.even : styles.odd]} key={item.id}>
                        <View style={styles.skateIcon}>{renderSkate(index)}</View>
                        <Text style={styles.skateText}>{dayjs(item.session_time).format('h:mma')} to {dayjs(item.session_time).add(item.duration, 'minute').format('h:mma')}{'\n'}<Text style={styles.highlight}>{item.name}</Text> ({item.count} of {item.size})</Text>
                    </View>
                ))}
            </ScrollView>
            <SkateButton title={"Signup (" + registered.length + ")"} color={global.DARK_COLOR} onPress={handleSignup} />
            <View>
                <Text style={styles.accountText}>Freestyles: {accountData.numFree}<Text style={styles.green }>({accountData.numFreePass})</Text><Text style={styles.highlight}> | </Text>Classes: {accountData.numClasses}<Text style={styles.highlight}> | </Text>Purchased: {accountData.adjustments}</Text>
                <Text style={styles.accountText}>Balance: <Text style={ balance <= 0 ? styles.error: null }>{balance}</Text></Text>
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
            alignItems: 'left',
            marginVertical: 2
        },
        skateIcon: {
            width: 40,
            height: 40,
            alignItems: 'left'
        },
        skateText: {
            fontSize: 16,
            paddingTop:3,
            paddingBottom:3,
            marginLeft:10,
            marginRight:5,
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
        header: {
            paddingLeft: 10,
            paddingVertical: 3,
            backgroundColor: "#DDDDDD"
        },
        headerText: {
            fontSize: 16
        },
        odd: {
            backgroundColor: "#DDDDDD"
        },
        even: {

        },
        memberData: {
            flexDirection: 'row',
        },
        member: {
            paddingRight: 10,
            marginLeft: 'auto'
        }
    });

export default Signup;