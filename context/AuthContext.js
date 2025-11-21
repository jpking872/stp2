// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import * as Constants from '../utils/global';
import moment from 'moment-timezone';
export const AuthContext = createContext({ isAuthenticated: false, userData: [], venueData: [] });

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState([]);
    const [venueData, setVenueData] = useState([]);
    const [signupDate, setSignupDate] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {

        const skaterToken = SecureStore.getItem('skaterToken');
        console.log("Auth:" + skaterToken);

        const isAuth = () => {

            if (!skaterToken) return;

            const response = axios.get(
                Constants.API_URL + '/api/isAuthenticated',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }
            ).then(response => {
                console.log("Auth response: " + response.data);
                setIsAuthenticated(response.data === 'authenticated');
                getUserData();
                getVenueData();
            });

        }

        isAuth();
        const getUserData = () => {
            const response = axios.get(
                Constants.API_URL + '/api/user-data',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }
            ).then(response => {
                console.log("userData: " + response.data);
                setUserData(response.data);
            });
        }

        const getVenueData = () => {
            const response = axios.get(
                Constants.API_URL + '/api/freestyle/venue',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }
            ).then(response => {
                console.log("venueData: " + response.data);
                setVenueData(response.data);
                moment.tz.setDefault(response.data.timezone);
            });
        }

        }, [isAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
    }
    const logout = () => {
        setIsAuthenticated(false);
        setUserData([]);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userData, venueData, signupDate, setSignupDate}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
