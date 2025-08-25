import {useEffect, useState} from "react";
import axios from "axios";
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Utils from '../utils/functions';
import dayjs from 'dayjs';
import * as React from "react";
import Calendar from './Calendar';

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

    const [showPicker, setShowPicker] = useState(false);

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
            content = <MaterialIcons name="check" style={styles.highlight} size={32} color="#1976d2" />
        } else if (sessions[i].count >= sessions[i].size || (accountData.balance < 0 && !passThisDay) || (!isRegistered(i) && now.isAfter(regSessionTime))) {
            content = <MaterialIcons name="clear" style={styles.lightColor} size={32} color="#1976d2" />
        } else {
            content = <TouchableOpacity onPress={() => clickedSkate(i)}>
                            <MaterialIcons name="ice-skating" style={isRegistered(i) ? styles.darkColor : styles.lightColor } size={32} />
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
        <View>
            <Text>{message}</Text>
            <View>{pass ? <FontAwesome name="star" /> : null }</View>
            <Text>{dayjs(signupDate).format('MMMM D, YYYY')}</Text>
            <View>
                {sessions && sessions.map((item, index) => (
                    <Text key={item.id}>{dayjs(item.session_time).format('h:mma')} to {dayjs(item.session_time).add(item.duration, 'minute').format('h:mma')} {item.name} ({item.size - item.count} of {item.size})
                        {renderSkate(index)}</Text>
                ))}
            </View>
                <Button title="Signup" style={styles.signupButton} onClick={handleSignup} />
            <View>
                <Text>Freestyles: {accountData.numFree}</Text><Text style={styles.highlight}>({accountData.numFreePass})</Text>
                <Text>Classes: {accountData.numClasses}</Text>
                <Text>Purchased: {accountData.adjustments}</Text>
                <Text>Balance:</Text><Text style={ balance > 0 ? null : styles.error }>{balance}</Text>
            </View>
            <View>
                <Button title="Select Date" onPress={() => { setShowPicker(!showPicker); console.log('showPicker ' + showPicker); }} />
                <Calendar showPicker={showPicker} onUpdate={(value) => ChangeDate(value)} />
            </View>
        </View>
    )
}

const DARK_COLOR = '#1B1DA8';
const LIGHT_COLOR= '#969696';
const HIGHLIGHT = '#FF8103';

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 50,
        },
        item: {
            backgroundColor: '#f9c2ff',
            padding: 20,
            marginVertical: 8,
            marginHorizontal: 16,
        },
        title: {
            fontSize: 32,
        },
        highlight: {
            color: HIGHLIGHT
        },
        error: {
            color: '#F20202'
        },
        darkColor: {
            color: DARK_COLOR
        },
        lightColor: {
            color: LIGHT_COLOR
        },
        signupButton: {
            color:'#FFFFFF',
            backgroundColor: DARK_COLOR
        }
    });

export default Signup;