import {useEffect, useState, useRef} from "react";
import axios from "axios";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Button,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Utils from '../utils/functions';
import * as Constants from '../utils/global';
import * as React from "react";
import Calendar from './Calendar';
import SkateGesture from './SkateGesture';
import SkateButton from './SkateButton';
import Loading from './Loading';
import Profile from './Profile';
import SkateText from './SkateText';
import ConfirmBox from "./ConfirmBox";
import {useAuth} from "../context/AuthContext";

function Schedule() {

    const { signupDate, setSignupDate } = useAuth();
    const [schedule, setSchedule] = useState([]); // State to store fetched data
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling

    const skaterToken = Utils.getStore('skaterToken');

    const { width, height } = useWindowDimensions();
    const isTablet = width >= 768;
    const styles = createStyles({ isTablet: isTablet})

    useEffect(() => {

        if (!skaterToken) return;
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/freestyle/schedule/' + signupDate, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                });
                setSchedule(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();

    }, [ signupDate, loading]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <SkateText>Error: {error.message}</SkateText>;
    }

    function ChangeDate(value) {
        setLoading(true);
        setSignupDate(value);
    }

    return (

        <View style={styles.container}>
            <Profile pass={false} date={signupDate}/>
            <ScrollView>
                <View>
                    <View style={styles.tableHeader}>
                        <SkateText>Schedule for the week</SkateText>
                    </View>
                    {schedule && schedule.length ? (
                        schedule.map((item, index) => (
                            <View style={[styles.skaterRow, index % 2 === 0 ? null : styles.odd]} key={index}>
                                <SkateText style={styles.skaterName}>{item.date}</SkateText>
                                <SkateText style={styles.skaterSessions}>{item.text}</SkateText>
                            </View>
                        ))) : (
                        <View style={styles.indentText}><SkateText>No freestyles scheduled this week.</SkateText></View>
                    )}
                </View>
            </ScrollView>
            <View>
                <Calendar onUpdate={(value) => ChangeDate(value)} />
            </View>
        </View>
    )


}

const createStyles = (styleVars) =>
    StyleSheet.create({
        container: {
            flex: 1,
            height: '100%',
            margin: 8,
        },
        skaterRow: {
            flex: 1,
            alignItems: 'left',
            marginVertical: 0,
            paddingVertical:3,
            flexDirection: styleVars.isTablet ? 'row' : 'column'
        },
        skaterName: {
            paddingLeft: 5,
            width: styleVars.isTablet ? '30%' : '100%'

        },
        skaterSessions: {
            marginLeft:5,
            marginRight:5,
            color: global.DARK_COLOR
        },
        odd: {
            backgroundColor: "#DDDDDD"
        },
        indentText: {
            marginLeft: 5,
            marginTop: 3
        },
        tableHeader: {
            marginTop: 5,
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
    });
export default Schedule;