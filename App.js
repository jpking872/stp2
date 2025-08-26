import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Skaters from './components/Skaters';
import Signup from './components/Signup';
import Classes from './components/Classes';
import Summary  from './components/Summary';
import Header from './components/Header';
import Login from './components/Login';
import './utils/global';

  function HomeScreen() {
    return (
        <Login />
    );
  }

  function SkatersScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Skaters Screen</Text>
        </View>
    );
  }

function SignupScreen() {
    return (
            <Signup />
    )
}

function ClassesScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Skaters Screen</Text>
        </View>
    );
}

function SummaryScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Skaters Screen</Text>
        </View>
    );
}

  const Tab = createBottomTabNavigator();

  export default function App() {

    return (
        <NavigationContainer style={styles.container}>
          <Header title="Skate to the Point" />
          <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = 'home';
                  } else if (route.name === 'Skaters') {
                    iconName = 'air';
                  } else if (route.name === 'Signup') {
                      iconName = 'ice-skating';
                  } else if (route.name === 'Classes') {
                      iconName = 'bookmark';
                  } else if (route.name === 'Summary') {
                      iconName = 'summarize';
                  }
                    return <MaterialIcons name={iconName} size={30} color={global.DARK_COLOR} />
                },
                tabBarActiveTintColor: global.HIGHLIGHT,
                tabBarInactiveTintColor: 'gray',
                  headerShown: false
              })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Skaters" component={SkatersScreen} />
            <Tab.Screen name="Signup" component={SignupScreen} />
            <Tab.Screen name="Classes" component={ClassesScreen} />
            <Tab.Screen name="Summary" component={SummaryScreen} />
          </Tab.Navigator>


        </NavigationContainer>


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
