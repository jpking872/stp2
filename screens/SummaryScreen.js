import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState, useEffect } from 'react';
import '../utils/global';
import SkateLink from '../components/SkateLink';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as Utils from "../utils/functions";

function SummaryScreen() {

    const navigation = useNavigation();
    const logout = async () => await axios.get(
        "http://skateapi.kingjonathan.com/api/logout", {
            headers: {
                Authorization: "Bearer " + Utils.getStore("skaterToken")
            }
        })
        .then((res) => {
            if (res.data) {
                Utils.deleteStore("skaterToken");
            }
        });


        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Summary Screen</Text>
                <TouchableOpacity onPress={() => logout() }>
                    <Text style={styles.text}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
}

const styles = () => StyleSheet.create({
    text: {
        color: global.DARK_COLOR,
        textDecorationLine: 'underline'
    },
});

export default SummaryScreen;