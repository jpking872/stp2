import React, {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Button, Platform } from 'react-native';

function Calendar({showPicker, onUpdate}) {

    const [date, setDate] = useState(new Date());

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        console.log('date selected ' + currentDate);
        const formattedDate = dayjs(currentDate).format('YYYY-MM-DD'); // Format the date
        onUpdate(formattedDate);
        setDate(currentDate);
    }

    return (
            <View>
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
            </View>
    )



}

export default Calendar;