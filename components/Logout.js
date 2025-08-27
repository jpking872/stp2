import {React, useEffect} from 'react';
import axios from "axios";
import * as Utils from '../utils/functions';
import * as Constants from '../utils/global';
import { useNavigation } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../context/AuthContext';

function Logout() {

    const navigation = useNavigation();
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {

        axios
            .get(Constants.API_URL + "/api/logout", {
                headers: {
                    Authorization: "Bearer " + Utils.getStore("skaterToken"),
                },
            })
            .then((res) => {
                if (res.data) {
                    Utils.deleteStore("skaterToken");
                    logout();
                }
            });

    }, []);

    return (
        <h2>Logging out</h2>
    )
}

export default Logout;