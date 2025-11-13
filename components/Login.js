import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, View, Linking } from 'react-native';
import * as Constants  from '../utils/global';
import * as Utils from '../utils/functions';
import axios from "axios";
import { TextInput } from 'react-native-paper';
import Loading from "./Loading";
import SkateButton from "./SkateButton";
import SkateLink from "./SkateLink";
import { useNavigation } from '@react-navigation/native';
import { AuthProvider, useAuth } from '../context/AuthContext';
function Login() {

    const { isAuthenticated, login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(false); // State for loading indicator
    const [validateError, setValidateError] = useState([]);
    const [message, setMessage] = useState(null); // State for loading indicator
    const navigation = useNavigation();

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
        if (!password) {
            newErrors.push('Password is required');
        } else if (password.length < 8 || password.length > 15)  {
            newErrors.push('Password must be at least 8 characters and less than 15 characters');
        }
        setValidateError(newErrors)
        return newErrors.length === 0; // Return true if no errors
    };

    const handleLogin = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    Constants.API_URL + '/api/login',{

                        email: email,
                        password: password
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    }
                );
                if (response.data.loggedin == 'valid') {
                    setMessage("Welcome.");
                    setIsLoggedIn(true);
                    Utils.setStore('skaterToken', response.data.token, 7);
                    login();
                    setLoading(false);
                } else if (response.data.loggedin == 'not approved') {
                    setMessage("Your account has not been approved yet.");
                    setIsLoggedIn(false);
                    setLoading(false);
                } else {
                    setMessage("Invalid login.");
                    setIsLoggedIn(false);
                    setLoading(false);
                }
            } catch (err) {
                setError(err);
            }
        }

    }

    return (
            <View style={styles.container}>
                <Text style={styles.headerText}>Login</Text>
                { message ? (<Text style={styles.item}>{message}</Text>) : null }
                { validateError.length > 0 ? (<Text style={styles.item}>{validateError.join("\n")}</Text>) : null }
                    <TextInput style={styles.item} label="Email" mode="outlined" onChangeText={setEmail} value={email}/>
                    <TextInput style={styles.item} label="Password" mode="outlined" onChangeText={setPassword} value={password} secureTextEntry/>
                    <View style={styles.item}>
                        <SkateButton title="Login" color={global.DARK_COLOR} onPress={handleLogin} disabled={false} />
                    </View>
                    <SkateLink title="Forgot password?" destination="ForgotPassword"></SkateLink>
                    <SkateLink title="Create an account" destination="Register" />
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
    }

})
export default Login;