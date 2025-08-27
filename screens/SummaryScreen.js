import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState, useEffect } from 'react';
import '../utils/global';
import SkateLink from '../components/SkateLink';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as Utils from "../utils/functions";
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as Constants from "../utils/global";

function SummaryScreen() {

    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();
    const logoutPressed = async () => await axios.get(
        Constants.API_URL + "/api/logout", {
            headers: {
                Authorization: "Bearer " + Utils.getStore("skaterToken")
            }
        })
        .then((res) => {
            if (res.data) {
                Utils.deleteStore("skaterToken");
                logout();
            }
        });


        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Summary Screen</Text>
                <TouchableOpacity onPress={() => logoutPressed() }>
                    <Text style={styles.textColor}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
}

const styles = () => StyleSheet.create({
    textColor: {
        color: global.DARK_COLOR,
        textDecorationLine: 'underline'
    }
});

export default SummaryScreen;