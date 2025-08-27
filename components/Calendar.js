import React, {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Button, Platform } from 'react-native';
import SkateButton from './SkateButton';
import '../utils/global';

function Calendar({onUpdate}) {

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        const formattedDate = dayjs(currentDate).format('YYYY-MM-DD'); // Format the date
        setShowPicker(Platform.OS === 'ios');
        onUpdate(formattedDate);
        setDate(currentDate);
    }

    return (
            <View>
                <SkateButton title="Choose Date" color={global.DARK_COLOR} onPress={() => setShowPicker(true)} />
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                        themeVariant="light"
                        accentColor={global.DARK_COLOR}
                        textColor={global.DARK_COLOR}
                        style={{ backgroundColor: "#DDDDDD"}}
                    />
                )}
            </View>
    )



}

export default Calendar;