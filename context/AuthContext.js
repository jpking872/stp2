// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import * as Constants from '../utils/global';
import dayjs from 'dayjs';
export const AuthContext = createContext({ isAuthenticated: false, userData: [] });

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState([]);
    //const [signupDate, setSignupDate] = useState(dayjs());
    const [signupDate, setSignupDate] = useState(dayjs().format('YYYY-MM-DD'));

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

        }, [isAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
    }
    const logout = () => {
        setIsAuthenticated(false);
        setUserData([]);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userData, signupDate, setSignupDate}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
