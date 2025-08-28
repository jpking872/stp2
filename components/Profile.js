import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import '../utils/global';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import dayjs from "dayjs";

function Profile(props) {

    return (
        <View style={styles.header}>{props.pass ? <MaterialIcons name="key" style={styles.green} size={32} /> : <MaterialIcons name="ice-skating" style={styles.darkColor} size={32} />}
            <View style={styles.memberData}>
                <Text style={styles.headerText}>Nick Riviera</Text>
                <Text style={[styles.headerText, styles.member]}>Junior Freeskate</Text>
            </View>
            <View style={styles.memberData}>
                <Text style={[styles.headerText, styles.highlight]}>{dayjs(props.date).format('ddd MMMM D, YYYY')}</Text>
                <Text style={[styles.headerText, styles.member]}>Mar 2025</Text>
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
        headerText: {
            fontSize: 16
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
    });

export default Profile;