import {Image, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import '../utils/global';
import SkateText from "../components/SkateText";
import SkateButton from "../components/SkateButton";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../context/AuthContext";

function HomeScreen() {

    const navigation = useNavigation();
    const { isAuthenticated, logout, venueData } = useAuth();
    function gotoLogin() {
        navigation.navigate("Login");
    }

    function gotoRegister() {
        navigation.navigate("Register");
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/icon.png')} style={styles.headerImage} />
            { isAuthenticated ? (
                <View>
                    <SkateText style={styles.messageText}>{venueData.message}</SkateText>
                </View>
            ) : (
                <View>
                    <View style={{ marginBottom: 15 }}><SkateButton title="Sign in" color={global.DARK_COLOR} onPress={gotoLogin} disabled={false} /></View>
                    <View><SkateButton title="Create account" color={global.DARK_COLOR} onPress={gotoRegister} disabled={false} /></View>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cccccc'
    },
    headerImage: {
        width: 320,
        height: 320,
        marginBottom: 30,
        backgroundColor:'#222222'
    },
    messageText: {
        fontSize: 18,
        color: global.DARK_COLOR
    }
})

export default HomeScreen;