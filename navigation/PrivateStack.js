import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import HomeScreen from '../screens/HomeScreen';
import SkatersScreen from '../screens/SkatersScreen';
import SignupScreen from '../screens/SignupScreen';
import ClassesScreen from '../screens/ClassesScreen';
import SummaryScreen from '../screens/SummaryScreen';

const Tab = createBottomTabNavigator();
function PublicStack() {
    return (
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
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Skaters" component={SkatersScreen} />
        <Tab.Screen name="Signup" component={SignupScreen} />
        <Tab.Screen name="Classes" component={ClassesScreen} />
        <Tab.Screen name="Summary" component={SummaryScreen} />
    </Tab.Navigator>
    );
}

export default PublicStack;