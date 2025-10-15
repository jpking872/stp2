import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Header from './components/Header';
import './utils/global';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PublicStack from './navigation/PublicStack';
import PrivateStack from './navigation/PrivateStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

  export default function App() {

    return (

        <SafeAreaProvider>
          <AuthProvider>
          <NavigationContainer style={styles.container}>
              <Header title="Skate to the Point" />
              <AuthContext.Consumer>
                  {({ isAuthenticated }) =>
                      isAuthenticated ? <PrivateStack /> : <PublicStack />
                  }
              </AuthContext.Consumer>
            </NavigationContainer>
          </AuthProvider>
        </SafeAreaProvider>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.BG_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.select({
      ios: 25,
      android: 14
    }),
  },
});
