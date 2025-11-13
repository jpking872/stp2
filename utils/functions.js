import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import axios from "axios";

export function setStore(name, token, days) {
    if (Platform.OS === 'web') {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // 30 days from now
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + token + ";" + expires + ";path=/";
    } else {
        SecureStore.setItem(name , token);
    }
}

export function getStore(name) {
    if (Platform.OS === 'web') {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            while (cookie.charAt(0) === " ") cookie = cookie.substring(1, cookie.length);
            if (cookie.indexOf(nameEQ) === 0)
                return cookie.substring(nameEQ.length, cookie.length);
        }
        return null;
    } else {
        return SecureStore.getItem(name);
    }

}

export async function deleteStore(name) {
    if (Platform.OS === 'web') {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else {
        await SecureStore.deleteItemAsync(name);
    }

}