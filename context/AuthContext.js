// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext({ isAuthenticated: false });

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = () => {
            const token = SecureStore.getItem('skaterToken');
            console.log(token)
            setIsAuthenticated(!!token);
        };
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};