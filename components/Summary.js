import React, {useEffect, useState} from "react";
import axios from "axios";
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import * as Utils from '../utils/functions';
import * as Constants from '../utils/global';
import dayjs from 'dayjs';
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../context/AuthContext";
import Loading from './Loading';
import Profile from './Profile';
import Calendar from "./Calendar";
import SkateText from './SkateText';

function Summary() {

    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();

    const [signupDate, setSignupDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [freestyles, setFreestyles] = useState([]);
    const [classes, setClasses] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [history, setHistory] = useState([]);
    const [accountData, setAccountData] = useState({});
    const [balance, setBalance] = useState(0); //
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling

    const skaterToken = Utils.getStore('skaterToken');
    console.log("Summary:" + skaterToken);

    useEffect(() => {

        if (!skaterToken) return;

        const fetchFreestyle = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/summary/freestyles', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                console.log(response.data)
                setFreestyles(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFreestyle();

        const fetchClasses = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/summary/classes', {
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

        const fetchAdjustment = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/summary/adjustments', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                setAdjustments(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdjustment();

        const fetchHistory = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/summary/all', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                console.log(response.data)
                setHistory(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

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

    }, []);

    const logoutPressed = async () => await axios.get(
        Constants.API_URL + "/api/logout", {
            headers: {
                Authorization: "Bearer " + skaterToken
            }
        })
        .then((res) => {
            if (res.data) {
                Utils.deleteStore("skaterToken");
                logout();
            }

    });

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <SkateText>Error: {error.message}</SkateText>;
    }

    function RecentFreestyleTable() {
        return (
            <View>
                <View style={styles.tableHeader}>
                    <SkateText style={styles.centerText}>Freestyles</SkateText>
                </View>
            { freestyles && freestyles.length ? (
                freestyles.map((freestyle, index) => (
                    <View key={index} style={styles.summaryRow}>
                        <SkateText style={styles.summaryDate}>{dayjs(freestyle.freestyleDate).format('MMM D, YYYY')}</SkateText>
                        <SkateText style={styles.summaryTitle}>{freestyle.freestyleName}</SkateText>
                        <SkateText style={ freestyle.freestylePass === 1 ? [styles.summaryNumber, styles.green] : styles.summaryNumber }>{freestyle.numSessions}</SkateText>
                    </View>
            ))): (
                <SkateText style={styles.centerText}>No freestyles</SkateText>
                )}
            </View>
        );
    }


    function RecentClassesTable() {

        return (
            <View>
                <View style={styles.tableHeader}>
                    <SkateText style={styles.centerText}>Classes</SkateText>
                </View>
                { classes && classes.length ? (
                    classes.map((c, index) => (
                        <View key={index} style={styles.summaryRow}>
                            <SkateText style={styles.summaryDate}>{dayjs(c.classDate).format('MMM D, YYYY')}</SkateText>
                            <SkateText style={styles.summaryClass}>{c.classTitle}</SkateText>
                        </View>
                    ))): (
                    <SkateText style={styles.centerText}>No classes</SkateText>
                )}
            </View>
        );

    }

    function RecentAdjustmentTable() {

        return (
            <View>
                <View style={styles.tableHeader}>
                    <SkateText style={styles.centerText}>Adjustments</SkateText>
                </View>
                { adjustments && adjustments.length ? (
                    adjustments.map((adjustment, index) => (
                        <View key={index} style={styles.summaryRow}>
                            <SkateText style={styles.summaryDate}>{dayjs(adjustment.actionDate).format('MMM D, YYYY')}</SkateText>
                            <SkateText style={styles.summaryTitle}>{adjustment.title}</SkateText>
                            <SkateText style={ styles.summaryNumber }>{adjustment.points}</SkateText>
                        </View>
                    ))): (
                    <SkateText style={styles.centerText}>No adjustments</SkateText>
                )}
            </View>
        );

    }

    function HistoryTable() {

        return (

        <View>
            <View style={styles.tableHeader}>
                <SkateText style={styles.centerText}>History</SkateText>
            </View>
            <View style={[styles.summaryRow, styles.odd, styles.historyHeader]}>
                <SkateText style={styles.historyDate}> </SkateText>
                <SkateText style={styles.historyNumber}>Free</SkateText>
                <SkateText style={styles.historyNumber}>Class</SkateText>
                <SkateText style={styles.historyNumber}>Pass</SkateText>
                <SkateText style={styles.historyNumber}>Adj</SkateText>
                <SkateText style={styles.historyNumber}>$</SkateText>
            </View>
            <ScrollView>
            { history && history.length ? (
                history.map((h, index) => (
                    <View key={index} style={styles.summaryRow}>
                        <SkateText style={styles.historyDate}>{dayjs(h.year + "-" + h.month + "-01").format('MMM YYYY')}</SkateText>
                        <SkateText style={ styles.historyLargeNumber }>{h.freestyles}-{h.freestyles_pass}</SkateText>
                        <SkateText style={ styles.historyNumber }>{h.classes}</SkateText>
                        <SkateText style={ styles.historyNumber }>{h.passes}</SkateText>
                        <SkateText style={ styles.historyNumber }>{h.adjustments}</SkateText>
                        <SkateText style={ styles.historyNumber }>{h.amount}</SkateText>
                    </View>
                ))): (
                <SkateText style={styles.centerText}>No history</SkateText>
            )}
            </ScrollView>
        </View>

        );

    }

    return (
        <View style={styles.container}>
            <Profile pass={false} date={signupDate}/>
            <ScrollView>
                <RecentFreestyleTable />
                <RecentClassesTable />
                <RecentAdjustmentTable />
                <HistoryTable />
            </ScrollView>
            <View style={styles.accountView}>
                <SkateText style={styles.accountText}>Freestyles: {accountData.numFree}<SkateText style={styles.green }>({accountData.numFreePass})</SkateText><SkateText style={styles.highlight}> | </SkateText>Classes: {accountData.numClasses}<SkateText style={styles.highlight}> | </SkateText>Purchased: {accountData.adjustments}</SkateText>
                <SkateText style={styles.accountText}>Balance: <SkateText style={ balance <= 0 ? styles.error: null }>{balance}</SkateText></SkateText>
            </View>
            <TouchableOpacity onPress={() => logoutPressed() }>
                <SkateText style={styles.LogoutLink}>Logout</SkateText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        marginVertical: 10,
        marginHorizontal: 10
    },
    summaryRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'left',
        marginVertical: 0,
        paddingVertical: 0
    },
    summaryDate: {
        width: '27%',
        paddingLeft: 5

    },
    summaryTitle: {
        width: '64%',
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    summaryNumber: {
        width: '10%',
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    summaryClass: {
        width: '70%',
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    historyDate: {
        width: '26%',
        paddingLeft: 5
    },
    historyLargeNumber: {
        width:'14%',
        color: global.DARK_COLOR,
        textAlign: 'center'
    },
    historyNumber: {
        textAlign: 'center',
        width: '11%',
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    even: {

    },
    odd: {
        backgroundColor: "#DDDDDD"
    },
    centerText: {
        textAlign: 'center'
    },
    tableHeader: {
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
        backgroundColor: "#DDDDDD",
    },
    historyHeader: {
        paddingVertical: 3
    },
    darkColor: {
        color: global.DARK_COLOR
    },
    highlight: {
        color: global.HIGHLIGHT
    },
    green: {
        color: global.GREEN
    },
    LogoutLink: {
        color:global.highlight,
        textAlign: 'right',
        paddingBottom: 5,
        paddingRight: 3
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

})

export default Summary;