import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Skaters from './components/Skaters';
import Signup from './components/Signup';
import Classes from './components/Classes';
import Summary  from './components/Summary';
import Calendar from './components/Calendar';

  function HomeScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Home Screen</Text>
        </View>
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
    return <Signup />;
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
        <NavigationContainer>
          <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = 'home';
                  } else if (route.name === 'Skaters') {
                    iconName = 'folder';
                  } else if (route.name === 'Signup') {
                      iconName = 'envelope';
                  } else if (route.name === 'Classes') {
                      iconName = 'book';
                  } else if (route.name === 'Summary') {
                      iconName = 'cloud';
                  }
                  return <FontAwesome name={iconName} size={30} color="#000" />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
