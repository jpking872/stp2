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

function Summary() {

    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();

    const currentDateTime = '2025-07-16 09:30:00';
    const [signupDate, setSignupDate] = useState(dayjs(currentDateTime).format('YYYY-MM-DD'));
    const [freestyles, setFreestyles] = useState([]);
    const [classes, setClasses] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [history, setHistory] = useState([]);
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
                setHistory(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

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
        return <Text>Error: {error.message}</Text>;
    }

    function RecentFreestyleTable() {
        return (
            <View>
                <View style={styles.tableHeader}>
                    <Text style={styles.indentText}>Freestyles</Text>
                </View>
            { freestyles && freestyles.length ? (
                freestyles.map((freestyle, index) => (
                    <View key={index} style={styles.summaryRow}>
                        <Text style={styles.summaryDate}>{dayjs(freestyle.freestyleDate).format('MMM D, YYYY')}</Text>
                        <Text style={styles.summaryTitle}>{freestyle.freestyleName}</Text>
                        <Text style={ freestyle.freestylePass === 1 ? [styles.summaryNumber, styles.green] : styles.summaryNumber }>{freestyle.numSessions}</Text>
                    </View>
            ))): (
                <Text style={styles.indentText}>No freestyles</Text>
                )}
            </View>
        );
    }


    function RecentClassesTable() {

        return (
            <View>
                <View style={styles.tableHeader}>
                    <Text style={styles.indentText}>Classes</Text>
                </View>
                { classes && classes.length ? (
                    classes.map((c, index) => (
                        <View key={index} style={styles.summaryRow}>
                            <Text style={styles.summaryDate}>{dayjs(c.classDate).format('MMM D, YYYY')}</Text>
                            <Text style={styles.summaryClass}>{c.classTitle}</Text>
                        </View>
                    ))): (
                    <View style={styles.indentText}><Text>No classes</Text></View>
                )}
            </View>
        );

    }

    function RecentAdjustmentTable() {

        return (
            <View>
                <View style={styles.tableHeader}>
                    <Text style={styles.indentText}>Adjustments</Text>
                </View>
                { adjustments && adjustments.length ? (
                    adjustments.map((adjustment, index) => (
                        <View key={index} style={styles.summaryRow}>
                            <Text style={styles.summaryDate}>{dayjs(adjustment.actionDate).format('MMM D, YYYY')}</Text>
                            <Text style={styles.summaryTitle}>{adjustment.title}</Text>
                            <Text style={ styles.summaryNumber }>{adjustment.points}</Text>
                        </View>
                    ))): (
                    <Text style={styles.indentText}>No adjustments</Text>
                )}
            </View>
        );

    }

    function HistoryTable() {

        return (

        <View>
            <View style={styles.tableHeader}>
                <Text style={styles.indentText}>History</Text>
            </View>
            <View style={[styles.summaryRow, styles.odd]}>
                <Text style={styles.historyDate}> </Text>
                <Text style={styles.historyNumber}>FS-P</Text>
                <Text style={styles.historyNumber}>CL</Text>
                <Text style={styles.historyNumber}>Pass</Text>
                <Text style={styles.historyNumber}>Adj</Text>
                <Text style={styles.historyNumber}>$</Text>
            </View>
            { history && history.length ? (
                history.map((h, index) => (
                    <View key={index} style={styles.summaryRow}>
                        <Text style={styles.historyDate}>{dayjs(h.month + "/1/" + h.year).format('MMM YYYY')}</Text>
                        <Text style={ styles.historyNumber }>{h.freestyles}-{h.freestyles_pass}</Text>
                        <Text style={ styles.historyNumber }>{h.classes}</Text>
                        <Text style={ styles.historyNumber }>{h.passes}</Text>
                        <Text style={ styles.historyNumber }>{h.adjustments}</Text>
                        <Text style={ styles.historyNumber }>{h.amount}</Text>
                    </View>
                ))): (
                <Text style={styles.indentText}>No history</Text>
            )}
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
            <TouchableOpacity onPress={() => logoutPressed() }>
                <Text style={styles.LogoutLink}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    summaryRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'left',
        marginVertical: 0,
        paddingVertical: 3
    },
    summaryDate: {
        width: '25%',
        paddingLeft: 5

    },
    summaryTitle: {
        width: '65%',
        fontSize: 14,
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    summaryNumber: {
        width: '10%',
        fontSize: 14,
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    summaryClass: {
        width: '70%',
        fontSize: 14,
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    historyDate: {
        width: '25%',
        paddingLeft: 5
    },
    historyNumber: {
        textAlign: 'center',
        width: '12%',
        fontSize: 14,
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    even: {

    },
    odd: {
        backgroundColor: "#DDDDDD"
    },
    indentText: {
        marginLeft: 5,
    },
    tableHeader: {
        marginVertical: 5,
        paddingHorizontal: 5,
        paddingVertical: 3,
        backgroundColor: "#DDDDDD",
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
    }

})

export default Summary;