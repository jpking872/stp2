import {React, useEffect} from 'react';
import axios from "axios";
import * as Utils from '../utils/functions';
import { useNavigation } from '@react-navigation/native';

function Logout() {

    const navigation = useNavigation();

    useEffect(() => {

        axios
            .get("http://skateapi.kingjonathan.com/api/logout", {
                headers: {
                    Authorization: "Bearer " + Utils.getStore("skaterToken"),
                },
            })
            .then((res) => {
                if (res.data) {
                    Utils.deleteStore("skaterToken");
                    navigation.navigate("Home");
                }
            });

    }, []);

    return (
        <h2>Logging out</h2>
    )
}

export default Logout;