import React, {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
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
    const handleConfirm = (dateEvent) => {
        let selectedDate = dateEvent.nativeEvent.timestamp;
        const currentDate = selectedDate || date;
        const formattedDate = dayjs(currentDate).format('YYYY-MM-DD'); // Format the date
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
                    onChange={handleConfirm}
                />
                )}
            </View>
    )

}

export default Calendar;