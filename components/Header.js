import { React, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function Header({title}) {

    const insets = useSafeAreaInsets();
    const styles = createStyles(insets);

    useEffect(() => {
        console.log('Safe area insets:', insets, 'platform:' , Platform.OS)
    }, [insets]);


    return (
            <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeView}>
                <View style={styles.container}>
                    <Image source={require('../assets/appHeader5.jpg')} style={styles.headerImage} />
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
        width: '100%',
        margin:0,
        padding:0
    },
    headerText: {
        fontSize:24,
        color: "#FFFFFF"
    }
})

export default Header;