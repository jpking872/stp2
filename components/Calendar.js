import React, {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DatePickerModal } from 'react-native-paper-dates';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { View, Button, Platform } from 'react-native';
import SkateButton from './SkateButton';
import SkateGesture from './SkateGesture';
import '../utils/global';

function Calendar({onUpdate}) {

    const [date, setDate] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);

    const showPicker = () => setIsVisible(true);
    const hidePicker = () => setIsVisible(false);
    const mobileConfirm = (dateEvent) => {
        let selectedDate = dateEvent.nativeEvent.timestamp;
        const currentDate = selectedDate || date;
        const formattedDate = dayjs(currentDate).format('YYYY-MM-DD'); // Format the date
        onUpdate(formattedDate);
        setDate(currentDate);
        hidePicker();
    };

    const webConfirm = (selectedDate) => {
        const currentDate = selectedDate || date;
        const formattedDate = dayjs(currentDate).format('YYYY-MM-DD'); // Format the date
        onUpdate(formattedDate);
        setDate(currentDate);
        hidePicker();
    };

    function MobileDatePicker() {

        return (

            <View>
                <SkateGesture title="Choose Date" color={global.DARK_COLOR} onPress={showPicker} />
                {isVisible && (
                    <DateTimePicker
                        mode="date"
                        value={date}
                        display="inline"
                        onChange={mobileConfirm}
                    />
                )}
            </View>

        )
    }

    function WebDatePicker() {

        return (
        <View>
            <SkateGesture title="Choose Date" color={global.DARK_COLOR} onPress={showPicker} />
            {isVisible && (
                <DatePickerModal
                    locale="en"
                    mode="single"
                    onDismiss={() => setIsVisible(false)}
                    date={date}
                    visible={isVisible}
                    onConfirm={({ date }) => {
                        webConfirm(date);
                    }}
                />
            )}
        </View>
        )

    }

    if (Platform.OS === 'web') {
        return (
            <WebDatePicker />
        )
    } else {
        return (
            <MobileDatePicker />
        )
    }

}

export default Calendar;
