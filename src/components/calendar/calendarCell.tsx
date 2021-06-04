import React from 'react';
import { View, Text } from 'react-native';
import { isFunction } from '../common/utils';
import { compareDate } from './dataUtils';
import styles from './styles';

import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

type RenderCellProps = {
    date: string;
    day: number;
    holiday: string;
    isToday: boolean;
    disabled: boolean;
    dateText: string;
    isCheck: boolean;
    isCheckIn: boolean;
    isCheckOut: boolean;
    marking: any;
}

export type CellProps = {
    date: string;
    day: number;
    placeholder: boolean;
    isToday: boolean;
    disabled: boolean;
    holiday: string;
    selectionStart: string;
    selectionEnd: string;
    selectionStartText: string;
    selectionEndText: string;
    marking: any;
    renderDate?: (params: RenderCellProps) => JSX.Element;
}

export const Cell = React.memo((props: CellProps): JSX.Element => {
    const {
        date,
        day,
        placeholder,
        isToday,
        disabled,
        selectionStart = '',
        selectionEnd = '',
        selectionStartText = '',
        selectionEndText = '',
        holiday='',
        renderDate
    } = props;

    // 如果只是占位，就直接返回
    if (placeholder || day === 0 || date === '') {
        return null;
    }

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

    const dateText: string = !!holiday ? holiday.split(' ')[0] : (isToday ? '今天' : `${day}`);

    if (isFunction(renderDate)) {
        const customizedNode: JSX.Element = renderDate({
            date,
            day,
            isToday,
            holiday,
            disabled,
            dateText,
            isCheck,
            isCheckIn,
            isCheckOut,
            marking: props.marking
        });

        if (React.isValidElement(customizedNode)) {
            return customizedNode;
        }
    }

    // 样式
    const cellstyles: Array<StyleProp<ViewStyle>> = [styles.cell];
    const datetxtStyles: Array<StyleProp<TextStyle>> = [styles.dateTxt];

    if (disabled) {
        datetxtStyles.push(styles.disableDateTxt);
    } else {
        // 节日时或今天
        if (isToday || !!holiday) {
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
})
