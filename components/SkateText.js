import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const SkateText = ({ style, ...props }) => {
    return <Text {...props} style={[styles.default, style]} />;
};

const styles = StyleSheet.create({
    default: {
        fontSize: Platform.select({
                ios: 14,
                android: 16
            }), // Set your default size here
        fontFamily: Platform.select({
            ios: 'San Francisco',
            android: 'Roboto'
        }),
        color: '#343434', // Optional default color
    },
});

export default SkateText;