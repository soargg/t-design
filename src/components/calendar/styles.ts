import { StyleSheet } from 'react-native';
import { pTd } from '../common/utils';
import { screenWidth } from '../common';

export default StyleSheet.create({
    calendarContainer: {
        flex: 1,
        flexGrow: 1,
        minHeight: 300,
        backgroundColor: '#fff'
    },
    // 星期
    weeks: {
        flexDirection: 'row',
        height: 30,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E9E9E9'
    },
    weektxt: {
        flexGrow: 1,
        fontSize: 12,
        lineHeight: 30,
        color: '#666666',
        textAlign: 'center'
    },

    // 月份
    monthTitle: {
        height: 56,
        lineHeight: 56,
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: '#fff',
        color: '#333333'
    },
    monthWeekGroup: {
        flexDirection: 'row',
        paddingVertical: 1,
    },
    dateCell: {
        flexGrow: 1,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: `${100 / 7}%`,
        minHeight: pTd(50)
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    range: {
        backgroundColor: 'rgba(255,150,69,0.15)'
    },
    checkInOut: {
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#FF9645'
    },
    checkIn: {
        backgroundColor: 'rgba(255,150,69,0.15)',
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        overflow: 'hidden',
    },
    checkOut: {
        backgroundColor: 'rgba(255,150,69,0.15)',
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4,
        overflow: 'hidden',
    },
    dateTxtWrap: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dateTxt: {
        fontSize: screenWidth > 375 ? 16 : 14,
        fontWeight: 'bold',
        color: '#333333'
    },
    disableDateTxt: {
        color: '#DADADA'
    },
    lineThrough: {
        position: 'absolute',
        width: 18,
        height: 1,
        transform: [{
            rotate: '-45deg'
        }],
        backgroundColor: '#DADADA'
    },
    checkInOutTxt: {
        color: '#ffffff'
    },
    subText: {
        fontSize: 11,
        marginBottom: 6,
        lineHeight: 11,
        fontWeight: 'bold',
        color: '#fff',
    },
    holidayText: {
        color: '#FF9645'
    }
});
