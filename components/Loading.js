import React, {useState} from 'react';
import { Text, StyleSheet, View } from 'react-native';
import '../utils/global';
import { ClipLoader } from 'react-spinners';

function Loading() {

    return (
        <View style={styles.container}>
            <ClipLoader size={50} />;
        </View>
    );
}

    const styles = () => StyleSheet.create({
        container: {
            alignItems:'center'
        }
    });

export default Loading;