import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, View, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import * as Constants from '../utils/global';
import * as Utils from '../utils/functions';
import axios from "axios";
import { TextInput } from 'react-native-paper';
import Loading from "./Loading";
import SkateButton from "./SkateButton";
import { useNavigation } from '@react-navigation/native';
import SkateLink from "./SkateLink";

function Register() {
    const navigation = useNavigation();
    const [parentFirst, setParentFirst] = useState('');
    const [parentLast, setParentLast] = useState('');
    const [skaterFirst, setSkaterFirst] = useState('');
    const [skaterLast, setSkaterLast] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(false); // State for loading indicator
    const [validateError, setValidateError] = useState([]);
    const [message, setMessage] = useState(""); // State for loading indicator

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
        if (!skaterFirst) {
            newErrors.push('Skater first name is required');
        }
        if (!skaterLast) {
            newErrors.push('Skater last name is required');
        }
        if (!authCode) {
            newErrors.push('Auth code is required');
        } else if (authCode.length != 6) {
            newErrors.push('Auth code must be 6 characters');
        }
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

        if (password != passwordConf) {
            newErrors.push('Confirmed password doesn\'t match');
        }
        setValidateError(newErrors)
        return newErrors.length === 0; // Return true if no errors
    };

    const handleRegister = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    Constants.API_URL + '/api/register',{

                        skaterfirst: skaterFirst,
                        skaterlast: skaterLast,
                        parentfirst: parentFirst,
                        parentlast: parentLast,
                        email: email,
                        password: password,
                        password_confirmation: passwordConf,
                        authcode: authCode

                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    }
                );
                if (response.data.registered === "valid") {
                    console.log(response.data)
                    setMessage("Welcome.");
                    setLoading(false);
                    navigation.navigate('Login');
                } else if (response.data.registered === "authcode not found") {
                    setMessage("Invalid auth code");
                    setLoading(false);
                } else {
                    setMessage("Invalid registration.");
                    setLoading(false)
                }
            } catch (err) {
                setLoading(false);
                setError(err);
            }
        }

    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
        <ScrollView style={styles.scrollView}>
            <Text style={styles.headerText}>Create an Account</Text>
                { message ? (<Text style={styles.item}>{message}</Text>) : null }
                { validateError.length > 0 ? (<Text style={styles.item}>{validateError.join("\n")}</Text>) : null }
                <TextInput style={styles.item} label="*Skater First Name" mode="outlined" required onChangeText={setSkaterFirst} value={skaterFirst}/>
                <TextInput style={styles.item} label="*Skater Last Name" mode="outlined" required onChangeText={setSkaterLast} value={skaterLast}/>
                <TextInput style={styles.item} label="Parent First Name" mode="outlined" onChangeText={setParentFirst} value={parentFirst}/>
                <TextInput style={styles.item} label="Parent Last Name" mode="outlined" onChangeText={setParentLast} value={parentLast}/>
                <TextInput style={styles.item} label="*Email" mode="outlined" required onChangeText={setEmail} value={email}/>
                <TextInput style={styles.item} label="*Password" mode="outlined" required onChangeText={setPassword} value={password} secureTextEntry/>
                <TextInput style={styles.item} label="*Password Confirmation" required mode="outlined" onChangeText={setPasswordConf} value={passwordConf} secureTextEntry/>
                <TextInput style={styles.item} label="*Auth Code" required mode="outlined" onChangeText={setAuthCode} value={authCode} />
                <View style={styles.item}>
                    <SkateButton title="Sign Up" color={global.DARK_COLOR} onPress={handleRegister} disabled={false} />
                </View>
                <SkateLink title="Return to sign in" destination="Login" />
        </ScrollView>
        </KeyboardAvoidingView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        marginTop: 30,
        marginHorizontal: 25,
        padding: 5,
        flexGrow: 1
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
export default Register;