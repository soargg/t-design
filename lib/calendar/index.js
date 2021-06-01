import React from 'react';
import { SectionList, View, Text, TouchableWithoutFeedback } from 'react-native';
import sectionListGetItemLayout from '../common/sectionListGetItemLayout';
import { isFunction } from '../common/utils';
import { compareDate, getWeekOrderInMonth } from './dataUtils';
import { CalendarCore } from './calendarCore';
import { Cell } from './calendarCell';
import styles from './styles';
const calendarCore = new CalendarCore;
export default class Calendar extends React.PureComponent {
    constructor(props) {
        super(props);
        // 起始日期
        this.selectionIn = this.props.selectionStart;
        // 结束日期
        this.selectionOut = this.props.selectionEnd;
        this.itemHeight = 60;
        this.checkInItemIndex = 0;
        this.checkInSectionIndex = 0;
        const { duration = 180, allowSelectionBeforeToday = false } = props;
        const start = Date.now();
        // 先更新
        calendarCore.update({ duration, allowSelectionBeforeToday });
        this.state = {
            monthData: calendarCore.getDateGroup()
        };
        console.log('耗时：', Date.now() - start);
    }
    static get displayName() { return 'Calendar'; }
    ;
    static getDerivedStateFromProps(nextProps) {
        const prevPorps = calendarCore.props;
        const { duration = 180, allowSelectionBeforeToday = false } = nextProps;
        if (JSON.stringify(duration) !== JSON.stringify(prevPorps.duration) ||
            allowSelectionBeforeToday !== prevPorps.allowSelectionBeforeToday) {
            calendarCore.update({ duration, allowSelectionBeforeToday });
            const monthData = calendarCore.getDateGroup();
            return {
                monthData
            };
        }
        return null;
    }
    componentDidMount() {
        this._location();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.selectionStart !== this.props.selectionStart) {
            this._location();
        }
    }
    scrollIntoView(animated = false) {
        console.log(this.checkInSectionIndex, this.checkInItemIndex);
        if (this.SectionListRef) {
            try {
                this.SectionListRef.scrollToLocation({
                    sectionIndex: this.checkInSectionIndex,
                    itemIndex: this.checkInItemIndex,
                    viewPosition: 0.5,
                    animated
                });
            }
            catch (error) { }
        }
    }
    _location() {
        const { selectionStart } = this.props;
        this.checkInItemIndex = getWeekOrderInMonth(selectionStart);
        if (selectionStart) {
            const index = calendarCore.monthMap.findIndex(m => m === selectionStart.slice(0, 7));
            this.checkInSectionIndex = index === -1 ? 0 : index;
        }
    }
    getItemLayout() {
        return sectionListGetItemLayout({
            getItemHeight: (_, __, ___) => this.itemHeight,
            getSectionHeaderHeight: () => 56,
            getSectionFooterHeight: () => 0,
            listHeaderHeight: 0,
        });
    }
    _onCheck(dateStr) {
        if (!dateStr)
            return;
        const { allowSingle = false, onChange } = this.props;
        // 允许单选
        if (allowSingle) {
            if (this.selectionIn !== dateStr) {
                this.selectionIn = dateStr;
                if (isFunction(onChange)) {
                    onChange({ selectionStart: this.selectionIn, selectionEnd: '' });
                }
            }
            return;
        }
        if (!this.selectionIn) {
            // 开始日期没选
            this.selectionIn = dateStr;
            this.selectionOut = '';
        }
        else if (this.selectionIn && !this.selectionOut) {
            if (this.selectionIn === dateStr) {
                // 存在开始日期，且与当前选相同
                return;
            }
            if (compareDate(new Date(this.selectionIn), new Date(dateStr))) {
                // 存在开始日期，且小于当前选相同
                this.selectionIn = dateStr;
                this.selectionOut = '';
            }
            else {
                this.selectionOut = dateStr;
            }
        }
        else {
            // 存在两端日期
            this.selectionIn = dateStr;
            this.selectionOut = '';
        }
        if (isFunction(onChange)) {
            onChange({ selectionStart: this.selectionIn, selectionEnd: this.selectionOut });
        }
    }
    renderSectionItem(section) {
        const { selectionStart, selectionEnd, selectionStartText, selectionEndText, markedDates = {}, renderDate } = this.props;
        const { week } = section.item;
        return (<View style={styles.monthWeekGroup} onLayout={(e) => {
                this.itemHeight = e.nativeEvent.layout.height || 60;
            }}>
                {week.map((item, idx) => {
                const { date, disabled } = item;
                const marking = markedDates ? markedDates[date] : null;
                const cellProps = {
                    ...item,
                    selectionStart,
                    selectionEnd,
                    selectionStartText,
                    selectionEndText,
                    marking,
                    renderDate
                };
                return (<TouchableWithoutFeedback key={`${date}_${idx}`} disabled={disabled} onPress={() => {
                        this._onCheck(date);
                    }}>
                            <View style={styles.dateCell} collapsable={false}>
                                <Cell {...cellProps}/>
                            </View>
                        </TouchableWithoutFeedback>);
            })}
            </View>);
    }
    render() {
        const { ListFooterComponent = null } = this.props;
        return (<View style={styles.calendarContainer}>
                <View style={styles.weeks}>
                    {['日', '一', '二', '三', '四', '五', '六'].map((week) => (<Text key={week} style={styles.weektxt}>
                            {week}
                        </Text>))}
                </View>
                <SectionList ref={(sl) => {
                this.SectionListRef = sl;
            }} initialNumToRender={100} // 为了滚动到底部，舍弃部分性能
         style={{ paddingHorizontal: 15 }} sections={this.state.monthData} stickySectionHeadersEnabled={false} keyExtractor={(item) => item.groupKey} renderSectionHeader={({ section: { title } }) => (<Text style={styles.monthTitle}>{title}</Text>)} ListFooterComponent={ListFooterComponent} renderItem={(item) => this.renderSectionItem(item)} getItemLayout={this.getItemLayout()}/>
            </View>);
    }
}
