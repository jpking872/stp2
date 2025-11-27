import React, {useEffect, useState} from "react";
import axios from "axios";
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import * as Utils from '../utils/functions';
import * as Constants from '../utils/global';
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../context/AuthContext";
import Loading from './Loading';
import Profile from './Profile';
import SkateText from './SkateText';
import moment from 'moment-timezone';
import {Calendar as FreestyleCalendar, CalendarList, Agenda} from 'react-native-calendars';

function Summary() {

    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();

    const [signupDate, setSignupDate] = useState(moment().format('YYYY-MM-DD'));
    const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
    const [freestyles, setFreestyles] = useState([]);
    const [classes, setClasses] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [history, setHistory] = useState([]);
    const [calendarData, setCalendarData] = useState([]);
    const [accountData, setAccountData] = useState({});
    const [balance, setBalance] = useState(0); //
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling
    const skaterToken = Utils.getStore('skaterToken');

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

    useEffect(() => {
        if (!freestyles || !classes) return;
        buildCalendarData();
    }, [freestyles, classes]);


    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <SkateText>Error: {error.message}</SkateText>;
    }

    function buildCalendarData() {

        let tmpData = [];
        for (const item of freestyles) {
            let dotsArray = [];
            let maxSessions = item.numSessions > 5 ? 5 : item.numSessions
            for (let i = 0; i < maxSessions; i++) {
                dotsArray.push({ key: `f-${item.freestyleDate}-${i}`, color: global.DARK_COLOR })
            }
            tmpData[item.freestyleDate] = { dots: dotsArray }
        }


        for (let i = 0; i < classes.length; i++) {
            let tmpClass = classes[i];
            let classDate = moment(tmpClass.classDate).format("YYYY-MM-DD")
            let inArray = false;
            for (let x in tmpData) {
                if (x == classDate) {
                    inArray = true;
                }
            }
            if (inArray) {
                let currentDots = tmpData[classDate].dots;
                currentDots.push({ key : `c-${classDate}-${i}`, color: global.HIGHLIGHT  });
                tmpData[tmpClass.classDate] = { dots : currentDots };
            } else {
                let dotsArray = [ { key : `c-${classDate}-${i}`, color: global.HIGHLIGHT }];
                tmpData[classDate] = { dots: dotsArray }
            }
        }
        setCalendarData(tmpData);
    }

    function updateLists(month) {
        let tmpDate = moment(`${month.year}-${month.month}`, "YYYY-M").endOf("month").format("YYYY-MM-DD");
        setStartDate(tmpDate)
    }

    function FreestyleHistory() {

        return (
            <View>
                <View style={styles.tableHeader}>
                    <SkateText style={styles.centerText}>Freestyles and Classes</SkateText>
                </View>
            <FreestyleCalendar
                markingType={'multi-dot'}
                markedDates={calendarData}
                current={startDate}
                key={startDate}
                onMonthChange={(month) => {
                    updateLists(month);
                }}
            />
            </View>
        )
    }

    function RecentFreestyleTable() {
        return (
            <View>
                <View style={styles.tableHeader}>
                    <SkateText style={styles.centerText}>Freestyles</SkateText>
                </View>
            { freestyles && freestyles.length ? (
                freestyles.map((freestyle, index) => (
                    moment(freestyle.freestyleDate).isBefore(moment(startDate)) &&
                    moment(freestyle.freestyleDate).isAfter(moment(startDate).subtract(1, "month")) ? (
                    <View key={index} style={styles.summaryRow}>
                        <SkateText style={styles.summaryDate}>{moment(freestyle.freestyleDate).format('MMM D, YYYY')}</SkateText>
                        <SkateText style={styles.summaryTitle}>{freestyle.freestyleName}</SkateText>
                        <SkateText style={ freestyle.freestylePass === 1 ? [styles.summaryNumber, styles.green] : styles.summaryNumber }>{freestyle.numSessions}</SkateText>
                    </View>
                    ) : null
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
                        moment(c.classDate).isBefore(moment(startDate)) &&
                        moment(c.classDate).isAfter(moment(startDate).subtract(1, "month")) ? (
                        <View key={index} style={styles.summaryRow}>
                            <SkateText style={styles.summaryDate}>{moment(c.classDate).format('MMM D, YYYY')}</SkateText>
                            <SkateText style={styles.summaryTitle}>{c.classTitle}</SkateText>
                            <SkateText style={styles.summaryNumber }>2</SkateText>
                        </View>
                        ) : null
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
                        moment(adjustment.actionDate).isBefore(moment(startDate)) &&
                        moment(adjustment.actionDate).isAfter(moment(startDate).subtract(1, "month")) ? (
                        <View key={index} style={styles.summaryRow}>
                            <SkateText style={styles.summaryDate}>{moment(adjustment.actionDate).format('MMM D, YYYY')}</SkateText>
                            <SkateText style={styles.summaryTitle}>{adjustment.title}</SkateText>
                            <SkateText style={ styles.summaryNumber }>{adjustment.points}</SkateText>
                        </View>
                        ) : null
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
                        <SkateText style={styles.historyDate}>{moment(`${h.year}-${h.month}`, "YYYY-M").format("MMM YYYY")}</SkateText>
                        <SkateText style={ styles.historyLargeNumber }>{h.freestyles}-{h.freestyles_pass}</SkateText>
                        <SkateText style={ styles.historyNumber }>{h.classes}</SkateText>
                        <SkateText style={ styles.historyNumber }>{h.passes > 0 ? "Y" : "-"}</SkateText>
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
                <FreestyleHistory />
                <RecentFreestyleTable />
                <RecentClassesTable />
                <RecentAdjustmentTable />
                <HistoryTable />
            </ScrollView>
            <View style={styles.accountView}>
                <SkateText style={styles.accountText}>Freestyles: {accountData.numFree}<SkateText style={styles.green }>({accountData.numFreePass})</SkateText><SkateText style={styles.highlight}> | </SkateText>Classes: {accountData.numClasses}<SkateText style={styles.highlight}> | </SkateText>Purchased: {accountData.adjustments}</SkateText>
                <SkateText style={styles.accountText}>Balance: <SkateText style={ balance <= 0 ? styles.error: null }>{balance}</SkateText></SkateText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        margin: 8
    },
    summaryRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'left',
        marginVertical: 0,
        paddingVertical: 0
    },
    summaryDate: {
        width: '30%',
        paddingLeft: 5

    },
    summaryTitle: {
        width: '55%',
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    summaryNumber: {
        width: '8%',
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR,
        textAlign: 'right'
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