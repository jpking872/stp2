import * as SecureStore from 'expo-secure-store';
import axios from "axios";

export function setStore(name, token, days) {
    SecureStore.setItem(name , token);
}

export function getStore(name) {
    return SecureStore.getItem(name);
}

export async function deleteStore(name) {
    await SecureStore.deleteItemAsync(name);
}