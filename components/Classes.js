import {useEffect, useState, useRef} from "react";
import axios from "axios";
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Utils from '../utils/functions';
import * as Constants from '../utils/global';
import dayjs from 'dayjs';
import * as React from "react";
import Calendar from './Calendar';
import SkateButton from './SkateButton';
import Loading from './Loading';
import Profile from './Profile';
import {useAuth} from "../context/AuthContext";

function Classes() {

    const { signupDate, setSignupDate } = useAuth();

    const [classes, setClasses] = useState([]); // State to store fetched data
    const [registered, setRegistered] = useState([]); // State to store fetched data
    const [originalRegistered, setOriginalRegistered] = useState([]); // State to store fetched data
    const [pass, setPass] = useState(false);
    const [accountData, setAccountData] = useState({});
    const [balance, setBalance] = useState(0); // State to store fetched data
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling
    const [reload, setReload] = useState(false);
    const availableSessions = useRef(0);
    availableSessions.count = 0;

    const skaterToken = Utils.getStore('skaterToken');
    console.log("Classes:" + skaterToken);

    useEffect(() => {

        if (!skaterToken) return;
        const fetchClasses = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/classes/get', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                setClasses(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();

        const fetchRegistered = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/classes/skater', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                setRegistered(response.data.classes);
                setOriginalRegistered(response.data.classes);
                setPass(response.data.pass);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistered();

        const fetchAccountData = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/summary/account', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                setAccountData(response.data);
                setBalance(response.data.balance);
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

    function ChangeDate(curdate) {
        setLoading(true);
        setSignupDate(curdate);
        setReload(true);
    }

    function isRegistered(i) {
        return registered.indexOf(classes[i].id) !== -1;
    }

    function isOriginalRegistered(i) {
        return originalRegistered.indexOf(classes[i].id) !== -1;
    }

    function clickedBook(i) {
        const regIndex = registered.indexOf(classes[i].id);
        const regCopy = registered.slice();
        const nf = accountData;
        if (regIndex !== -1) {
            regCopy.splice(regIndex, 1)
            setRegistered(regCopy);
            if (!pass) {
                nf.numClasses -= 1;
                setBalance(balance + 1);
            } else {
                nf.numClasses -= 1;
            }
        } else {
            regCopy.push(classes[i].id);
            setRegistered(regCopy);
            if (!pass) {
                nf.numClasses += 1;
                setBalance(balance - 1);
            } else {
                nf.numClasses += 1;
            }
        }
        setAccountData(nf);
    }

    function renderBook(i) {

        //const now = dayjs();
        const now = dayjs('2025-07-30 09:30:00');

        let sessionTime = dayjs(classes[i].start);
        let regSessionTime = dayjs(classes[i].start).add(30, 'minute');
        const passThisDay = false;
        let content;
        if (isOriginalRegistered(i) && now.isAfter(sessionTime)) {
            content = <MaterialIcons name="check" style={styles.darkColor} size={45} />
        } else if (classes[i].count >= classes[i].size || (accountData.balance < 0 && !passThisDay) || (!isRegistered(i) && now.isAfter(regSessionTime))) {
            content = <MaterialIcons name="clear" style={styles.lightColor} size={45} />
        } else {
            availableSessions.count += 1;
            content = <TouchableOpacity onPress={() => clickedBook(i)}>
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
        console.log('signing up for class:' + skaterToken);
        const response = async() => await axios.post(
            Constants.API_URL + '/api/classes/signup',{
                signup: registered
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + skaterToken
                }
            }

        ).then(response => { setRegistered(response.data); setLoading(false); setReload(true) });
        response();
    }

    return (

        <View style={styles.container}>
            <Profile pass={false} date={signupDate}/>
            <ScrollView style={styles.sessionScroll}>
                { classes && registered && classes.length ? (
                    classes.map((item, index) => (
                        <View style={[styles.sessionRow, index % 2 === 0 ? styles.even : styles.odd]} key={item.id}>
                            <View style={styles.skateIcon}>{renderBook(index)}</View>
                            <Text style={styles.skateText}>{dayjs(item.start).format('ddd MMM D h:mma')} to {dayjs(item.start).add(item.duration, 'minute').format('h:mma')}{'\n'}<Text style={styles.highlight}>{item.title} ({item.size - item.count} of {item.size})</Text></Text>
                        </View>
                    ))) : (
                    <View style={styles.indentText}><Text>No classes today</Text></View>
                )}
            </ScrollView>
            <SkateButton title={"Signup (" + registered.length + ")"} color={global.DARK_COLOR} onPress={handleSignup} disabled={ availableSessions.count == 0}/>
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
        marginHorizontal: 10,
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
    odd: {
        backgroundColor: "#DDDDDD"
    },
    indentText: {
        marginLeft: 10,
        marginTop: 3
    }
});

export default Classes;