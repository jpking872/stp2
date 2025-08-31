import {Image, StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import '../utils/global';
import SkateLink from "../components/SkateLink";
import SkateButton from "../components/SkateButton";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../context/AuthContext";

function HomeScreen() {

    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();
    function gotoLogin() {
        navigation.navigate("Login");
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/icon.png')} style={styles.headerImage} />
            { isAuthenticated ? null : (
                <SkateButton title="Sign in" color={global.DARK_COLOR} onPress={gotoLogin} disabled={false}/>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: global.DARK_COLOR
    },
    headerImage: {
        width: 240,
        height: 240,
        marginBottom: 80
    }
})

export default HomeScreen;