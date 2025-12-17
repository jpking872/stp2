import React from 'react';
import { WebView } from 'react-native-webview';

function PaymentScreen() {

    return (
        <WebView
            source={{uri: 'https://buy.stripe.com/test_6oU00c4NK3E8a4qf1C4ow04'}}
            style={{flex: 1}}
        />
    );

}
export default PaymentScreen;