import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect, useCallback} from 'react';
import Signup from '../components/Signup';
import '../utils/global';
import {useFocusEffect} from "@react-navigation/native";

function SignupScreen() {

    const [refreshKey, setRefreshKey] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setRefreshKey(prev => prev + 1); // Triggers re-render
        }, [])
    );

    return (
        <Signup key={refreshKey} />
    );
}

export default SignupScreen;