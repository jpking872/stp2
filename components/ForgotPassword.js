import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, View, Linking } from 'react-native';
import * as Constants  from '../utils/global';
import * as Utils from '../utils/functions';
import axios from "axios";
import { TextInput } from 'react-native-paper';
import Loading from "./Loading";
import SkateButton from "./SkateButton";
import SkateLink from "./SkateLink";

function ForgotPassword() {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(false); // State for loading indicator
    const [validateError, setValidateError] = useState([]);
    const [message, setMessage] = useState(null);
    const [sentEmail, setSentEmail] = useState(false); // State for loading indicator

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

    const handleSend = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const response = await axios.post(
                    Constants.API_URL + '/api/forgot-password',{
                        email: email
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        }
                    }
                );
                if (response.data.message === 'Password reset link sent successfully!') {
                    setSentEmail(true);
                    setLoading(false);
                } else {
                    setMessage("Invalid email.");
                    setLoading(false);
                }
            } catch (err) {
                setError(err);
            }
        }

    }

    return (
        <View>
        { sentEmail ? (
            <View style={styles.container}>
                <Text style={styles.headerText}>Send Password Reset Email</Text>
                <Text style={styles.resetText}>Your password reset request has been sent to your email.</Text>
                <SkateLink title="Return to sign in" destination="Login" />
            </View>
            ): (
            <View style={styles.container}>
                <Text style={styles.headerText}>Send Password Reset Email</Text>
                { message ? (<Text style={styles.item}>{message}</Text>) : null }
                { validateError.length > 0 ? (<Text style={styles.item}>{validateError.join("\n")}</Text>) : null }
                <TextInput style={styles.item} label="Email" mode="outlined" onChangeText={setEmail} value={email}/>
                <View style={styles.item}>
                    <SkateButton title="Send Password Reset Email" color={global.DARK_COLOR} onPress={handleSend} disabled={false} />
                </View>
                <SkateLink title="Return to sign in" destination="Login" />
            </View>
            )}
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
    resetText: {
        fontSize: 16,
        marginBottom:15
    }

})

export default ForgotPassword;