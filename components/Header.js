import { React, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {useAuth} from "../context/AuthContext";

function Header({title}) {

    const insets = useSafeAreaInsets();
    const styles = createStyles(insets);

    const { venueData } = useAuth();

    useEffect(() => {
        console.log('Safe area insets:', insets, 'platform:' , Platform.OS)
    }, [insets]);


    return (
            <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeView}>
                <View style={styles.container}>
                    <ImageBackground source={require('../assets/appHeader8.png')} style={styles.headerImage} >
                        <View style={styles.overlay}>
                            <Text style={styles.headerText}>{venueData.title}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </SafeAreaView>
    )

}

const createStyles = (insets) => StyleSheet.create({
    safeView: {
        marginTop: insets.top,
        height:57
    },
    container: {
        margin: 0,
        alignItems: 'center',
        backgroundColor: global.DARK_COLOR
    },
    headerImage: {
        width:'100%',
        height: 57,
        margin:0,
        padding:0
    },
    overlay: {
        alignItems: 'center'
    },
    headerText: {
        marginTop:24,
        fontSize:16,
        color: "#FDFDFD"
    }
})

export default Header;