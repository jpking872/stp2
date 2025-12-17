import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import React from "react";
import HomeScreen from '../screens/HomeScreen';
import SkatersScreen from '../screens/SkatersScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SignupScreen from '../screens/SignupScreen';
import ClassesScreen from '../screens/ClassesScreen';
import SummaryScreen from '../screens/SummaryScreen';
import AccountScreen from '../screens/AccountScreen';
import PaymentScreen from '../screens/PaymentScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PrivateStack() {

    function TabNavigator() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Home') {
                            iconName = 'home';
                        } else if (route.name === 'Skaters') {
                            iconName = 'air';
                        } else if (route.name === 'Schedule') {
                            iconName = 'event-available';
                        } else if (route.name === 'Signup') {
                            iconName = 'ice-skating';
                        } else if (route.name === 'Classes') {
                            iconName = 'bookmark';
                        } else if (route.name === 'Summary') {
                            iconName = 'summarize';
                        } else if (route.name === 'Account') {
                            iconName = 'work';
                        }
                        return <MaterialIcons name={iconName} size={30} color={global.DARK_COLOR} />
                    },
                    tabBarStyle: {
                        backgroundColor:'#EDEDED'
                    },
                    tabBarActiveTintColor: global.HIGHLIGHT,
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false
                })}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Skaters" component={SkatersScreen} />
                <Tab.Screen name="Schedule" component={ScheduleScreen} />
                <Tab.Screen name="Signup" component={SignupScreen} />
                <Tab.Screen name="Classes" component={ClassesScreen} />
                <Tab.Screen name="Summary" component={SummaryScreen} />
                <Tab.Screen name="Account" component={AccountScreen} />
            </Tab.Navigator>
        )
    }

    return (


    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>


);
}

export default PrivateStack;