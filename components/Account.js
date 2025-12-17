import React, {useState, useEffect} from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Constants  from '../utils/global';
import * as Utils from '../utils/functions';
import axios from "axios";
import Loading from "./Loading";
import SkateButton from "./SkateButton";
import SkateLink from "./SkateLink";
import { AuthProvider, useAuth } from '../context/AuthContext';
import SkateText from "./SkateText";
import {useNavigation} from "@react-navigation/native";

function Account() {

    const { isAuthenticated, login, logout } = useAuth();
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(false); // State for loading indicato
    const [message, setMessage] = useState(null);
    const [reload, setReload] = useState(false);
    const [accountData, setAccountData] = useState({});
    const [balance, setBalance] = useState(0);

    const products = [
        { title: "10 Freestyle Sessions ($115)", link: ""},
        { title: "30 Freestyle Sessions ($265)", link: ""},
        { title: "50 Freestyle Sessions ($405)", link: ""},
        { title: "Monthly Unlimited Freestyle Sessions ($400)", link: ""},
        { title: "Freestyle Walk On ($15)", link: ""}
    ];


    const skaterToken = Utils.getStore('skaterToken');

    useEffect(() => {
        const fetchAccountData = async () => {
            try {
                const response = await axios.get(Constants.API_URL + '/api/summary/account', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + skaterToken
                    }
                }); // Replace with your API endpoint
                const data = response.data;
                setAccountData(data);
                setBalance(data.balance);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountData();
        setReload(false);

    }, [reload])

    if (loading) {
        return (
            <Loading />
        );
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

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

        function gotoPayment() {
            navigation.navigate("Payment");
        }

    return (
            <View style={styles.container}>
                <Text style={styles.headerText}>My Account</Text>
                { message ? (<Text style={styles.item}>{message}</Text>) : null }
                    <View style={styles.item}>
                        <SkateButton title="Logout" color={global.DARK_COLOR} onPress={performLogout} disabled={false} />
                    </View>
                <Text style={styles.headerText}>Purchase Points</Text>
                <ScrollView>
                { products.map((product, index) => (
                    <View key={index} style={styles.productButton}>
                        <SkateButton title={product.title} color={global.DARK_COLOR} onPress={gotoPayment} disabled={false} />
                    </View>
                ))}
                </ScrollView>
                <View style={styles.accountView}>
                    <SkateText style={styles.accountText}>Freestyles: {accountData.numFree}<SkateText style={styles.green }>({accountData.numFreePass})</SkateText><SkateText style={styles.highlight}> | </SkateText>Classes: {accountData.numClasses}<SkateText style={styles.highlight}> | </SkateText>Purchased: {accountData.adjustments}</SkateText>
                    <SkateText style={styles.accountText}>Balance: <SkateText style={ balance <= 0 ? styles.error: null }>{balance}</SkateText></SkateText>
                </View>
            </View>
        )

    }

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginHorizontal:8,
        padding: 0,
        flex: 1,
        height:'100%'
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
    accountText: {
        textAlign: 'center'
    },
    accountView: {
        marginVertical:5,
        paddingVertical: 3,
        backgroundColor: "#DDDDDD",
        borderRadius:8
    },
    productButton: {
        marginTop: 5
    }

})
export default Account