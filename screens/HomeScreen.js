import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import '../utils/global';
import SkateLink from "../components/SkateLink";

function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home Screen</Text>
            <SkateLink title="Sign in" destination="Login" />
        </View>
    );
}

export default HomeScreen;