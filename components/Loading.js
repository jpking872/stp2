import React, {useState} from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import '../utils/global';

function Loading() {

    return (
        <View style={styles.container}>
            <ActivityIndicator size={50} color="#DDDDDD" style={{ marginTop: 50}} />
        </View>
    );
}
    const styles = () => StyleSheet.create({
        container: {
            flex: 1,
            justifyContent:'center'
        }
    });

export default Loading;