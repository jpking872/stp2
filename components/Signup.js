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
import SkateGesture from './SkateGesture';
import ConfirmBox from './ConfirmBox';
import Loading from './Loading';
import Profile from './Profile';
import SkateText from './SkateText';
import {useAuth} from "../context/AuthContext";

function Signup() {

    const { signupDate, setSignupDate } = useAuth();

    const [sessions, setSessions] = useState([]); // State to store fetched data
    const [registered, setRegistered] = useState([]); // State to store fetched data
    const [originalRegistered, setOriginalRegistered] = useState([]); // State to store fetched data
    const [pass, setPass] = useState(false);
    const [accountData, setAccountData] = useState({});
    const [balance, setBalance] = useState(0); // State to store fetched data
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling
    const [reload, setReload] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmBoxMessage, setConfirmBoxMessage] = useState("");
    const availableSessions = useRef(0);
    availableSessions.count = 0;

    const skaterToken = Utils.getStore('skaterToken');
    console.log("Signup:" + skaterToken);

    useEffect(() => {

        if (!skaterToken) return;

        const fetchSessions = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/freestyle/get/' + signupDate, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                const data = response.data;
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
                const response = await axios.get(Constants.API_URL + '/api/freestyle/skater/' + signupDate, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                const data = response.data
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
                const response = await axios.get(Constants.API_URL + '/api/summary/account', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                const data = response.data;
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
        return <SkateText>Error: {error.message}</SkateText>;
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

        const now = dayjs();

        let sessionTime = dayjs(sessions[i].session_time);
        let regSessionTime = dayjs(sessions[i].session_time).add(30, 'minute');
        const passThisDay = false;
        let content;
        if (isOriginalRegistered(i) && now.isAfter(sessionTime)) {
            content = <MaterialIcons name="check" style={styles.darkColor} size={45} />
        } else if (sessions[i].count >= sessions[i].size || (accountData.balance < 0 && !passThisDay) || (!isRegistered(i) && now.isAfter(regSessionTime))) {
            content = <MaterialIcons name="clear" style={styles.lightColor} size={45} />
        } else {
            availableSessions.count += 1;
            content = <TouchableOpacity onPress={() => clickedSkate(i)}>
                            <MaterialIcons name="ice-skating" style={isRegistered(i) ? styles.darkColor : styles.lightColor } size={45} />
                     </TouchableOpacity>
        }

        return (
            <>{content}</>
        )
    }

    function toggleConfirmBox() {
        let tmpShow = !showConfirm;
        setShowConfirm(tmpShow);
        let adds1 = registered.length === 1 ? "" : "s";
        let adds2 = originalRegistered.length === 1 ? "" : "s";
        setConfirmBoxMessage("Yes I want to sign up for " + registered.length + " freestyle" + adds1 + " on " +
            dayjs(signupDate).format("MMM D") + ". I was previously registered for " + originalRegistered.length + " freestyle" + adds2 + ".");
    }

    function handleSignup() {
        if (balance < 0) {
            setMessage("Balance is too low");
            return;
        }
        setLoading(true);
        console.log('signing up:' + skaterToken);
        const response = async () => await axios.post(
            Constants.API_URL + '/api/freestyle/signup', {
                sessionDate: signupDate,
                signup: registered
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + skaterToken
                }
            }
        ).then(response => {
            console.log(response.data)
            setRegistered(response.data);
            setLoading(false);
            setReload(true);
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
            <ConfirmBox visible={showConfirm} message={confirmBoxMessage} onPress={handleSignup} hideModal={toggleConfirmBox}></ConfirmBox>
            <Profile pass={false} date={signupDate}/>
            <ScrollView style={styles.sessionScroll}>
                {sessions && sessions.length ? (
                sessions.map((item, index) => (
                    <View style={[styles.sessionRow, index % 2 === 0 ? styles.even : styles.odd]} key={item.id}>
                        <View style={styles.skateIcon}>{renderSkate(index)}</View>
                        <SkateText style={styles.skateText}>{dayjs(item.session_time).format('h:mma')} to {dayjs(item.session_time).add(item.duration, 'minute').format('h:mma')}{'\n'}<SkateText style={styles.highlight}>{item.name}</SkateText> ({item.count} of {item.size})</SkateText>
                    </View>
                ))) : (
                    <View style={styles.indentText}><SkateText>No freestyles today</SkateText></View>
                )}
            </ScrollView>
            <SkateGesture title={"Signup (" + registered.length + ")"} color={global.DARK_COLOR} onPress={toggleConfirmBox} disabled={ availableSessions.count == 0}/>
            <View style={styles.accountView}>
                <SkateText style={styles.accountText}>Freestyles: {accountData.numFree}<SkateText style={styles.green }>({accountData.numFreePass})</SkateText><SkateText style={styles.highlight}> | </SkateText>Classes: {accountData.numClasses}<SkateText style={styles.highlight}> | </SkateText>Purchased: {accountData.adjustments}</SkateText>
                <SkateText style={styles.accountText}>Balance: <SkateText style={ balance <= 0 ? styles.error: null }>{balance}</SkateText></SkateText>
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
            marginHorizontal: 10
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
        accountView: {
            marginVertical:5,
            paddingVertical: 3,
            backgroundColor: "#DDDDDD",
            borderRadius:8
        },
        odd: {
            backgroundColor: "#DDDDDD"
        },
        indentText: {
            marginLeft: 10,
            marginTop: 3
        }
    });

export default Signup;