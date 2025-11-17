
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import '../utils/global';
import Schedule from '../components/Schedule';

function ScheduleScreen() {

        const [refreshKey, setRefreshKey] = useState(0);

        useFocusEffect(
            useCallback(() => {
                    setRefreshKey(prev => prev + 1); // Triggers re-render
            }, [])
        );

        return (
            <Schedule key={refreshKey}/>
        );

}

export default ScheduleScreen;

