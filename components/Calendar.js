import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Button, Platform } from 'react-native';
import SkateButton from './SkateButton';
import '../utils/global';
import moment from 'moment-timezone';

function Calendar({onUpdate}) {

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 7);
    yesterday.setHours(12, 0, 0, 0); // hours, minutes, seconds, milliseconds

    const [date, setDate] = useState(today);
    const [isVisible, setIsVisible] = useState(false);

    const showPicker = () => setIsVisible(true);
    const hidePicker = () => setIsVisible(false);
    const handleConfirm = (dateEvent) => {
        let selectedDate = dateEvent.nativeEvent.timestamp;
        const currentDate = selectedDate || date;
        const formattedDate = moment(currentDate).format('YYYY-MM-DD'); // Format the date
        onUpdate(formattedDate);
        setDate(currentDate);
        hidePicker();
    };

    return (
            <View>
                <SkateButton title="Choose Date" color={global.DARK_COLOR} onPress={showPicker} />
                {isVisible && (
                <DateTimePicker
                    mode="date"
                    value={date}
                    display="inline"
                    minimumDate={yesterday}
                    onChange={handleConfirm}
                />
                )}
            </View>
    )

}

export default Calendar;