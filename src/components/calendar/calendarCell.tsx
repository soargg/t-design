import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native' 
import styles from './styles';

import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type CellProps = {
    date: string;
    day: number;
    placeholder: boolean;
    isToday: boolean;
    disabled: boolean;
}

export const Cell = function(props: CellProps): JSX.Element {
    const { date, day, placeholder, isToday, disabled } = props;
    // 如果只是占位，就直接返回
    if (placeholder || day === 0 || date === '') {
        return null;
    }

    const dateText: string = isToday ? '今天' : `${day}`;
    // 样式
    const cellstyles: Array<StyleProp<ViewStyle>> = [styles.cell];
    const datetxtStyles: Array<StyleProp<TextStyle>> = [styles.dateTxt];

    if (disabled) {
        datetxtStyles.push(styles.disableDateTxt);
    } else {

    }

    return (
        <TouchableWithoutFeedback
            disabled={disabled}
            onPress={() => {
                console.log(date)
            }}
        >
            {/* 最外层只做入离日期选中的底色处理 */}
            <View style={[styles.cell]}>
                <View style={cellstyles}>
                    <Text style={ styles.subText } numberOfLines={1}>
                    {
                        // isCheckIn ? selectionStartText : ( isCheckOut ? selectionEndText : null)
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
        </TouchableWithoutFeedback>
    );
}
