import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from './components/Header';
import './utils/global';
import { AuthProvider, AuthContext } from './context/AuthContext';
import PublicStack from './navigation/PublicStack';
import PrivateStack from './navigation/PrivateStack';

  export default function App() {

    return (

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
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: global.BG_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
