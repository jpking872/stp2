
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import '../utils/global';
import Skaters from '../components/Skaters';

function SkatersScreen() {

        const [refreshKey, setRefreshKey] = useState(0);

        useFocusEffect(
            useCallback(() => {
                    setRefreshKey(prev => prev + 1); // Triggers re-render
            }, [])
        );

        return (
            <Skaters key={refreshKey}/>
        );

}

export default SkatersScreen;

