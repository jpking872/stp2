import React from 'react';
import { Text, StyleSheet, Platform } from 'react-native';

const SkateText = ({ children, style }) => {
    return (
        <Text style={[styles.default, style]}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    default: {
        fontSize: Platform.select({
                ios: 12,
                android: 14
            }), // Set your default size here
        fontFamily: Platform.select({
            ios: 'San Francisco',
            android: 'Roboto'
        }),
        color: '#343434', // Optional default color
    },
});

export default SkateText;