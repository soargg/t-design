import React from 'react';
import { View, Text } from 'react-native';
import holiday from './holiday';
import { compareDate } from './dataUtils';
import styles from './styles';


import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type CellProps = {
    date: string;
    day: number;
    placeholder: boolean;
    isToday: boolean;
    disabled: boolean;
    selectionStart: string;
    selectionEnd: string;
    selectionStartText: string;
    selectionEndText: string;
}

export const Cell = function(props: CellProps): JSX.Element {
    const {
        date,
        day,
        placeholder,
        isToday,
        disabled,
        selectionStart = '',
        selectionEnd = '',
        selectionStartText = '',
        selectionEndText = ''
    } = props;


    // 如果只是占位，就直接返回
    if (placeholder || day === 0 || date === '') {
        return null;
    }

    // 公历节日
    const solar: string = holiday.solar[date.slice(5)];
    const isholiday: boolean = !!solar;
    // 
    const isCheckIn = selectionStart === date;
    const isCheckOut = selectionEnd === date;

    // 选择区间
    let isCheck = false;
    if (selectionStart && selectionEnd) {
        const crrDate = new Date(date);
        const checkInDate = new Date(selectionStart);
        isCheck = compareDate(crrDate, checkInDate) && compareDate(new Date(selectionEnd), crrDate);
    }

    const dateText: string = isholiday ? solar : (isToday ? '今天' : `${day}`);
    // 样式
    const cellstyles: Array<StyleProp<ViewStyle>> = [styles.cell];
    const datetxtStyles: Array<StyleProp<TextStyle>> = [styles.dateTxt];

    if (disabled) {
        datetxtStyles.push(styles.disableDateTxt);
    } else {
        // 节日时或今天
        if (isToday || isholiday) {
            datetxtStyles.push(styles.holidayText)
        }

        if (isCheckIn || isCheckOut) {
            cellstyles.push(styles.checkInOut);
            datetxtStyles.push(styles.checkInOutTxt);
        } else if (isCheck) {
            cellstyles.push(styles.range);
        }
    }
    /* 最外层只做入离日期选中的底色处理 */
    return (
        <View style={[styles.cell]}>
            <View style={cellstyles}>
                <Text style={ styles.subText } numberOfLines={1}>
                {
                    isCheckIn ? selectionStartText : ( isCheckOut ? selectionEndText : null)
                }
                </Text>
                <View style={styles.dateTxtWrap}>
                    <Text style={ datetxtStyles } numberOfLines={1}>{dateText}</Text>
                    {
                        disabled ? <View style={ styles.lineThrough }/> : null
                    }
                </View>
            </View>
        </View>
    );
}
