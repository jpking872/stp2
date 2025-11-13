import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Header from './components/Header';
import './utils/global';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PublicStack from './navigation/PublicStack';
import PrivateStack from './navigation/PrivateStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

  export default function App() {

    return (
        <View style={styles.app}>
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
            <Header title="Skate to the Point" />
            <NavigationContainer style={styles.container}>
              <AuthContext.Consumer>
                  {({ isAuthenticated }) =>
                      isAuthenticated ? <PrivateStack /> : <PublicStack />
                  }
              </AuthContext.Consumer>
            </NavigationContainer>
            </AuthProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
        </View>

    );
  }

const styles = StyleSheet.create({
    app: {
        width: Platform.OS === 'web' ? 440 : '100%',
        height: Platform.OS === 'web' ? 800 : '100%',
        marginHorizontal: Platform.OS === 'web' ? 'auto' : 0,
        marginVertical: Platform.OS === 'web' ? 'auto' : 0,
    },
  container: {
    flex: 1,
    backgroundColor: global.BG_COLOR,
    alignItems: 'center'
  },
});
