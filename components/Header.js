import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

function Header({title}) {

    return (
            <View style={styles.container}>
                <Image source={require('../assets/appHeader.png')} style={styles.headerImage} />
            </View>
    )

}


const styles = StyleSheet.create({
    container: {
        height: 80,
        margin: 0,
        padding: 0,
        alignItems: 'center',
        backgroundColor: global.DARK_COLOR
    },
    headerImage: {
        maxWidth: 360,
        height: 80
    },
    headerText: {
        fontSize:24,
        color: "#FFFFFF"
    }
})

export default Header;