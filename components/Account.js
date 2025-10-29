import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, View, Linking } from 'react-native';
import * as Constants  from '../utils/global';
import * as Utils from '../utils/functions';
import axios from "axios";
import Loading from "./Loading";
import SkateButton from "./SkateButton";
import SkateGesture from "./SkateGesture";
import SkateLink from "./SkateLink";
import { AuthProvider, useAuth } from '../context/AuthContext';
function Account() {

    const { isAuthenticated, login, logout } = useAuth();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(false); // State for loading indicator
    const [validateError, setValidateError] = useState([]);
    const [message, setMessage] = useState(null); // State for loading indicator


    const skaterToken = Utils.getStore('skaterToken');

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    const validate = () => {
        const newErrors = [];
        if (!email) {
            newErrors.push('Email is required');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.push('Email address is invalid');
        }
        setValidateError(newErrors)
        return newErrors.length === 0; // Return true if no errors
    };

        const performLogout = async () => await axios.get(
            Constants.API_URL + "/api/logout", {
                headers: {
                    Authorization: "Bearer " + skaterToken
                }
            })
            .then((res) => {
                if (res.data) {
                    Utils.deleteStore("skaterToken");
                    logout();
                }

            });

    return (
            <View style={styles.container}>
                <Text style={styles.headerText}>My Account</Text>
                { message ? (<Text style={styles.item}>{message}</Text>) : null }
                    <View style={styles.item}>
                        <SkateGesture title="Logout" color={global.DARK_COLOR} onPress={performLogout} disabled={false} />
                    </View>
            </View>
        )

    }

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginHorizontal: 25,
        padding: 0
    },
    headerText: {
        fontSize: 20,
        color: global.DARK_COLOR,
        marginBottom:15
    },
    item: {
        marginBottom:15
    },
    LogoutLink: {
        color:global.highlight,
        textAlign: 'right',
        paddingBottom: 5,
        paddingRight: 3
    },

})
export default Account