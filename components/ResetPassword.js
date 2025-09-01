import { Text, StyleSheet, View, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Constants  from '../utils/global';
import * as Utils from '../utils/functions';
import axios from "axios";
import { TextInput } from 'react-native-paper';
import Loading from "./Loading";
import SkateButton from "./SkateButton";
import SkateLink from "./SkateLink";
import { useNavigation } from '@react-navigation/native';
function ResetPassword() {

    const navigation = useNavigation();

    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(false); // State for loading indicator
    const [validateError, setValidateError] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const handleDeepLink = (event) => {
            const url = event.url;
            const queryParams = new URL(url).searchParams;
            const email = queryParams.get('email');
            const token = queryParams.get('token');
            console.log('email: ' + email + ' token: ' + token);
        };

        const subscription = Linking.addEventListener('url', handleDeepLink);
        return () => subscription.remove();

    }, []);

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
        if (!password) {
            newErrors.push('Password is required');
        } else if (password.length < 8 || password.length > 15)  {
            newErrors.push('Password must be at least 8 characters and less than 15 characters');
        }
        if (password !== passwordConf) {
            newErrors.push('Confirmed password doesn\'t match');
        }
        setValidateError(newErrors)
        return newErrors.length === 0; // Return true if no errors
    };

    const handleReset = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    Constants.API_URL + '/api/reset-password',{

                        email: email,
                        token: token,
                        password: password,
                        password_confirmation: passwordConf
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    }
                );
                if (response.data.message === 'Password reset successfully!') {
                    setMessage("Welcome.");
                    navigation.navigate('Login');
                } else {
                    setMessage("Could not reset password.");
                    setLoading(false)
                }
            } catch (err) {
                setError(err);
            }
        }

    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Reset Password</Text>
            { message ? (<Text style={styles.item}>{message}</Text>) : null }
            { validateError.length > 0 ? (<Text style={styles.item}>{validateError.join("\n")}</Text>) : null }
            <TextInput style={styles.item} label="*Password" mode="outlined" required onChangeText={setPassword} value={password} secureTextEntry/>
            <TextInput style={styles.item} label="*Password Confirmation" required mode="outlined" onChangeText={setPasswordConf} value={passwordConf} secureTextEntry/>
            <View style={styles.item}>
                <SkateButton title="Reset Password" color={global.DARK_COLOR} onPress={handleReset} disabled={false} />
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
    }

})

export default ResetPassword;