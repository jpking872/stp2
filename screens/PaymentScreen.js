import React from 'react';
import { WebView } from 'react-native-webview';

function PaymentScreen({route}) {

    const { paymentLink }  = route.params;

    return (
        <WebView
            source={{uri: paymentLink}}
            style={{flex: 1}}
        />
    );

}
export default PaymentScreen;