import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState, useEffect } from 'react';
import '../utils/global';
import SkateLink from '../components/SkateLink';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as Utils from "../utils/functions";
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as Constants from "../utils/global";
import Summary from "../components/Summary";

function SummaryScreen() {

    return (
        <Summary />
    );

}

export default SummaryScreen;