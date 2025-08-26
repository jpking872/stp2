import * as SecureStore from 'expo-secure-store';

export function setStore(name, token, days) {
    SecureStore.setItem(name , token);
}

export function getStore(name) {
    return SecureStore.getItem(name);
}

export function deleteStore(name) {
    SecureStore.deleteItem(name);
}