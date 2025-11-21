import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, View } from 'react-native';
import '../utils/global';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useAuth} from "../context/AuthContext";
import SkateText from './SkateText';
import moment from 'moment-timezone';

function Profile(props) {

    const { userData, venueData } = useAuth();
    const [currentTime, setCurrentTime ] = useState(getCurrentTime());

    function getCurrentTime() {
        return moment().add(15, "second").format("h:mma");
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.header}>
            <View style={styles.iconRow}>
                <View style={styles.leftSide}>
                    <MaterialIcons name="ice-skating" style={styles.levelIcon} size={32} />
                    {props.pass || 1 ? <MaterialIcons name="key" style={styles.green} size={32} /> : null }
                </View>
                <View style={styles.rightSide}>
                    <SkateText style={styles.clock}>{currentTime}</SkateText>
                </View>
            </View>
            <View style={styles.memberData}>
                <SkateText style={styles.headerText}>{userData.sfname + " " + userData.slname}</SkateText>
                <SkateText style={[styles.headerText, styles.member]}>{ userData.levelName}</SkateText>
            </View>
            <View style={styles.memberData}>
                <SkateText style={[styles.headerText, styles.highlight]}>{moment(props.date).format('ddd MMMM D, YYYY')}</SkateText>
                <SkateText style={[styles.headerText, styles.member]}>since {moment(userData.created_at).format('MMM YYYY')}</SkateText>
            </View>
        </View>
    );
}
    const styles = StyleSheet.create({
        header: {
            paddingLeft: 5,
            paddingVertical: 5,
            backgroundColor: "#DDDDDD"
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
            paddingRight: 5,
            marginLeft: 'auto'
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
        iconRow: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        levelIcon : {
            color: global.DARK_COLOR,
            marginRight:3
        },
        leftSide: {
            flexDirection: 'row'
        },
        rightSide: {
            flexDirection: 'row'
        },
        clock: {
            color: global.DARK_COLOR,
            textAlign: 'right',
            paddingRight: 5
        }
    });

export default Profile;