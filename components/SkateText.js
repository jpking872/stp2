// components/MyAppText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

const MyAppText = ({ style, ...props }) => {
    return <Text {...props} style={[styles.default, style]} />;
};

const styles = StyleSheet.create({
    default: {
        fontSize: 14, // Set your default size here
        fontFamily: '', // Or your custom font
        color: '#343434', // Optional default color
    },
});

export default MyAppText;