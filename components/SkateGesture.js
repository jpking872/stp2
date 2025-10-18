import React, {useState} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import '../utils/global';

function SkateGesture(props) {

    const styles = createStyles(props);

    const tapGesture = props.disabled ? Gesture.Tap().enabled(false) : Gesture.Tap().numberOfTaps(2).onStart(props.onPress)

    return (
        <GestureDetector gesture={tapGesture}>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>{props.title}</Text>
            </TouchableOpacity>
        </GestureDetector>
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
            fontWeight: '600',
        },
    });

export default SkateGesture;