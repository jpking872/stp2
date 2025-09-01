import React, {useState} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import '../utils/global';
import { useNavigation } from '@react-navigation/native';

function SkateLink(props) {

    const navigation = useNavigation();

    return (
            <TouchableOpacity onPress={() => navigation.navigate(props.destination)}>
                <Text style={styles.text}>{props.title}</Text>
            </TouchableOpacity>
    );
}

    const styles= StyleSheet.create({
        text: {
            color: global.DARK_COLOR,
            textDecorationLine: 'underline',
            marginBottom: 10,
            fontSize: 16
        },
    });

export default SkateLink;