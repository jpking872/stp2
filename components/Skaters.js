import React from 'react';
import {useEffect, useState} from "react";
import axios from "axios";
import * as Utils from "../utils/functions";
import * as Constants from '../utils/global';
import dayjs from 'dayjs';
import Calendar from "./Calendar";
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import SkateButton from './SkateButton';
import Loading from './Loading';
import { DataTable } from 'react-native-paper';
import Profile from "./Profile";
import {useAuth} from "../context/AuthContext";

function Skaters() {

    const { signupDate, setSignupDate } = useAuth();

    const [sessions, setSessions] = useState("");
    const [skaters, setSkaters] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling

    const skaterToken = Utils.getStore('skaterToken');
    console.log("Skaters:" + skaterToken);

    useEffect(() => {

        if (!skaterToken) return;

        const fetchSessions = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/freestyle/sessions/' + signupDate, {
                    headers: {
                        Authorization: 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                setSessions(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();

        const fetchToday = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/freestyle/today/' + signupDate, {
                    headers: {
                        Authorization: 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                setSkaters(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchToday();

        const fetchClasses = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/classes/today/' + signupDate, {
                    headers: {
                        Authorization: 'Bearer ' + skaterToken
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

    }, [signupDate]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    function SkaterTable() {
        return (
            <View>
                <View style={styles.tableHeader}>
                    <Text>Freestyles</Text>
                    <Text style={styles.darkColor}>{ sessions }</Text>
                </View>
                <View style={[styles.skaterRow, styles.odd]}>
                    <Text style={styles.skaterName}>Skater</Text>
                    <Text style={styles.skaterSessions}>Sessions</Text>
                </View>
                {skaters && skaters.length ? (
                    skaters.map((skater, index) => (
                        <View style={[styles.skaterRow, index % 2 === 0 ? styles.even : styles.odd]} key={skater.id}>
                            <Text style={styles.skaterName}>{skater.skater}</Text>
                            <Text style={styles.skaterSessions}>{skater.sessions}</Text>
                        </View>
                    ))) : (
                    <View style={styles.indentText}><Text>No skaters today</Text></View>
                )}
            </View>
        );
    }

    function ClassTable() {
        return (
            <View>
                <View style={styles.tableHeader}>
                    <Text>Classes</Text>
                </View>
                { classes &&
                    classes.map((c, index) => (
                    <View key={c.id} style={[styles.classRow, index % 2 === 0 ? styles.odd: null]}>
                        <Text style={styles.classTitle}>{ c.title } {dayjs(c.start).format('h:mma')} - {dayjs(c.start).add(c.duration, 'minute').format('h:mma')}</Text>
                        <Text style={styles.classParticipants}>{c.participants.length > 0 ? c.participants : "No skaters"}</Text>
                    </View>
                ))}
            </View>
        );
    }

    function ChangeDate(value) {
        setSignupDate(value);
    }

    return (

        <View style={styles.container}>
            <Profile pass={false} date={signupDate}/>
            <ScrollView>
                <SkaterTable />
                <ClassTable />
            </ScrollView>
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
    skaterRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'left',
        marginVertical: 0,
        paddingVertical:3
    },
    skaterName: {
        width: '30%',
        paddingLeft: 5

    },
    skaterSessions: {
        width: '70%',
        fontSize: 14,
        marginLeft:5,
        marginRight:5,
        color: global.DARK_COLOR
    },
    odd: {
        backgroundColor: "#DDDDDD"
    },
    indentText: {
        marginLeft: 10,
        marginTop: 3
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
    classRow: {
        marginVertical: 0,
        paddingVertical: 3
    },
    classTitle: {
        paddingHorizontal: 5
    },
    classParticipants: {
        paddingHorizontal: 5,
        color: global.DARK_COLOR
    }
})

export default Skaters;