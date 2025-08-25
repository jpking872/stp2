import React, {useState} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import '../utils/global';

function SkateButton({title, onPress}) {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}

    const styles = StyleSheet.create({
        container: {
            alignItems:'center',
        },
        button: {
            backgroundColor: global.DARK_COLOR,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            maxWidth: '75%',
            width:'100%'

        },
        text: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
    });

export default SkateButton;