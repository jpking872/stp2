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

function Skaters() {

    const currentDateTime = '2025-07-16 09:30:00';
    const [signupDate, setSignupDate] = useState(dayjs(currentDateTime).format('YYYY-MM-DD'));
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
                <Text>Freestyles { dayjs(signupDate).format("MMMM D, YYYY") }</Text>
                <Text>{ sessions }</Text>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Skater</DataTable.Title>
                        <DataTable.Title>Session</DataTable.Title>
                    </DataTable.Header>

                    { skaters.map((skater) => (
                        <DataTable.Row key={skater.id}>
                            <DataTable.Cell>{skater.skater}</DataTable.Cell>
                            <DataTable.Cell>{skater.sessions}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                </DataTable>
            </View>
        );
    }

    function ClassTable() {
        return (
            <View>
                <Text>Classes</Text>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Class</DataTable.Title>
                        <DataTable.Title>Participants</DataTable.Title>
                    </DataTable.Header>

                    { classes.map((c) => (
                        <DataTable.Row key={c.id}>
                            <DataTable.Cell>{ c.title } {dayjs(c.start).format('h:mma')} - {dayjs(c.start).add(c.duration, 'minute').format('h:mma')}</DataTable.Cell>
                            <DataTable.Cell>{c.participants}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                </DataTable>
            </View>
        );
    }

    function ChangeDate(value) {
        setSignupDate(value);
    }

    return (

        <>
            <SkaterTable />
            <ClassTable />
            <Calendar onUpdate={(value) => ChangeDate(value)} />
        </>

    )

}

export default Skaters;