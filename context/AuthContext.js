// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import * as Constants from '../utils/global';
export const AuthContext = createContext({ isAuthenticated: false });

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        const skaterToken = SecureStore.getItem('skaterToken');
        console.log("Auth:" + skaterToken);

        const isAuth = () => {

            const response = axios.get(
                Constants.API_URL + '/api/isAuthenticated',
                {
                    headers: {
                        Authorization: 'Bearer ' + skaterToken
                    }
                }
            ).then(response => {
                console.log("Auth response: " + response.data);
                setIsAuthenticated(response.data === 'authenticated')
            });

        }

        isAuth();

    }, []);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);


    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
