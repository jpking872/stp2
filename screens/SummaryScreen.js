import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useCallback, useState } from 'react';
import '../utils/global';
import SkateLink from '../components/SkateLink';
import { useFocusEffect } from '@react-navigation/native';
import Summary from "../components/Summary";

function SummaryScreen() {

    const [refreshKey, setRefreshKey] = useState(0);

    useFocusEffect(
        useCallback(() => {
            setRefreshKey(prev => prev + 1); // Triggers re-render
        }, [])
    );

    return (
        <Summary key={refreshKey}/>
    );

}

export default SummaryScreen;