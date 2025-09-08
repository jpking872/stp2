import React, {useState} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import '../utils/global';

function SkateButton(props) {

    const styles = createStyles(props);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={props.onPress} disabled={props.disabled}>
                <Text style={styles.text}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    );
}

    const createStyles = (props) => StyleSheet.create({
        container: {
            alignItems:'center'
        },
        button: {
            backgroundColor: props.disabled ? '#DDDDDD' : props.color,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            width:'100%',
            marginHorizontal: 0
        },
        text: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
        },
    });

export default SkateButton;