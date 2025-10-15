import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import '../utils/global';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import dayjs from "dayjs";
import {useAuth} from "../context/AuthContext";
import SkateText from './SkateText';

function Profile(props) {

    const { userData } = useAuth();
    console.log(userData)

    return (
        <View style={styles.header}>
            <View style={styles.iconRow}>
            <MaterialIcons name="ice-skating" style={styles.levelIcon} size={32} />
            {props.pass || 1 ? <MaterialIcons name="key" style={styles.green} size={32} /> : null }
            </View>
            <View style={styles.memberData}>
                <SkateText style={styles.headerText}>{userData.sfname + " " + userData.slname}</SkateText>
                <SkateText style={[styles.headerText, styles.member]}>{ userData.levelName}</SkateText>
            </View>
            <View style={styles.memberData}>
                <SkateText style={[styles.headerText, styles.highlight]}>{dayjs(props.date).format('ddd MMMM D, YYYY')}</SkateText>
                <SkateText style={[styles.headerText, styles.member]}>since {dayjs(userData.created_at).format('MMM YYYY')}</SkateText>
            </View>
        </View>
    );
}
    const styles = StyleSheet.create({
        header: {
            paddingLeft: 10,
            paddingVertical: 3,
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
            paddingRight: 10,
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
            flexDirection: 'row'
        },
        levelIcon : {
            color: global.DARK_COLOR,
            marginRight:3
        }
    });

export default Profile;