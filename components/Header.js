import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Header({title}) {

    return (
            <SafeAreaView style={styles.safeView}>
                <View style={styles.container}>
                    <Image source={require('../assets/appHeader5.jpg')} style={styles.headerImage} />
                </View>
            </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    safeView: {
        height:57,
        margin:0,
        paddingBottom:9
    },
    container: {
        height:57,
        margin: 0,
        padding: 0,
        alignItems: 'center',
        backgroundColor: global.DARK_COLOR
    },
    headerImage: {
        width: 600,
        height:57,
        margin:0,
        padding:0

    },
    headerText: {
        fontSize:24,
        color: "#FFFFFF"
    }
})

export default Header;