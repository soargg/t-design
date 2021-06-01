import React from 'react';
import { SectionList, View, Text, TouchableWithoutFeedback } from 'react-native';
import { isFunction } from '../common/utils';
import { compareDate } from './dataUtils'; 
import { CalendarCore, DataSourceModal, WeekGroup, DateModel } from './calendarCore';
import { Cell, CellProps } from './calendarCell';
import styles from './styles';

import type { SectionListRenderItemInfo } from 'react-native';

interface FromToModel {
    selectionStart: string;
    selectionEnd: string;
}
interface CalendarProps {
    duration?: number | [string, string],
    /**
     * selectionStart
     * check 开始日期
     */
    selectionStart?: string;
    /**
     * selectionStartText
     * check 开始日期提示文案
     */
    selectionStartText?: string;
    /**
     * selectionEnd
     * check 结束日期
     */
    selectionEnd?: string;
    /**
     * selectionEndText
     * check 结束日期提示文案
     */
    selectionEndText?: string;
    /**
     * allowSingle
     * 允许选择单个日期
     */
    allowSingle?: boolean;
    /**
     * allowSelectionBeforeToday
     * 允许选择今天之前的日期
     */
    allowSelectionBeforeToday?: boolean;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
     /**
     * readerDate
     * 自定义每一个日期格的样式
     */
    renderDate?(day: CellProps): JSX.Element;
    /**
     * onChange
     * @param fromTo FromToModel
     * 日期选择是回调
     */
    onChange?(fromTo: FromToModel): void;
}

interface CalendarState {
    beginDate: Date,
    monthData: DataSourceModal[]
}

const calendarCore = new CalendarCore;

export default class Calendar extends React.PureComponent<CalendarProps, CalendarState> {
    // 起始日期
    private selectionIn: string = this.props.selectionStart;
    // 结束日期
    private selectionOut: string = this.props.selectionEnd;

    constructor(props: CalendarProps) {
        super(props);
        const { duration = 180, allowSelectionBeforeToday=false } = props;
        const start = Date.now();
        // 先更新
        calendarCore.update({duration, allowSelectionBeforeToday});
        this.state = {
            monthData: calendarCore.getDateGroup(),
            beginDate: calendarCore.startDate
        }

        console.log('耗时：', Date.now() - start);
    }

    private _onCheck(dateStr: string) {
        if (!dateStr) return;
        const { allowSingle = false, onChange } = this.props;

        // 允许单选
        if (allowSingle) {
            if (this.selectionIn !== dateStr) {
                this.selectionIn = dateStr;
                if (isFunction(onChange)) {
                    onChange({selectionStart: this.selectionIn, selectionEnd: ''});
                }
            }
            return;
        }

        if (!this.selectionIn) {
            // 开始日期没选
            this.selectionIn = dateStr;
            this.selectionOut = '';
        } else if (this.selectionIn && !this.selectionOut) {
            if (this.selectionIn === dateStr) {
                // 存在开始日期，且与当前选相同
                return
            }

            if (compareDate(new Date(this.selectionIn), new Date(dateStr))) {
                // 存在开始日期，且小于当前选相同
                this.selectionIn = dateStr;
                this.selectionOut = '';
            } else {
                this.selectionOut = dateStr;
            }
        } else {
            // 存在两端日期
            this.selectionIn = dateStr;
            this.selectionOut = '';
        }

        if (isFunction(onChange)) {
            onChange({selectionStart: this.selectionIn, selectionEnd: this.selectionOut});
        }

    }

    private renderSectionItem(section: SectionListRenderItemInfo<WeekGroup>): JSX.Element {
        const { selectionStart, selectionEnd, selectionStartText, selectionEndText } = this.props;
        const { week } = section.item;

        return (
            <View style={styles.monthWeekGroup}>
                {week.map((item: DateModel, idx) => {
                    const { date, disabled } = item;
                    const cellProps: CellProps = {
                        ...item,
                        selectionStart,
                        selectionEnd,
                        selectionStartText,
                        selectionEndText
                    };
                    return (
                        <TouchableWithoutFeedback
                            key={`${date}_${idx}`}
                            disabled={disabled}
                            onPress={() => {
                                this._onCheck(date);
                            }}
                        >
                            <View style={styles.dateCell} collapsable={false}>
                                <Cell {...cellProps} />
                            </View>
                        </TouchableWithoutFeedback>
                    );
                })}
            </View>
        );
    }

    render() {
        const { ListFooterComponent = null } = this.props;
        return (
            <View style={styles.calendarContainer}>
                <View style={styles.weeks}>
                    {['日', '一', '二', '三', '四', '五', '六'].map((week) => (
                        <Text key={week} style={styles.weektxt}>
                            {week}
                        </Text>
                    ))}
                </View>
                <SectionList
                    // ref={(sl) => {
                    //     this.SectionListRef = sl;
                    // }}
                    initialNumToRender={100} // 为了滚动到底部，舍弃部分性能
                    style={{ paddingHorizontal: 15 }}
                    sections={this.state.monthData}
                    stickySectionHeadersEnabled={false}
                    keyExtractor={(item: WeekGroup) => item.groupKey}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.monthTitle}>{title}</Text>
                    )}
                    ListFooterComponent={ListFooterComponent}
                    renderItem={(item) => this.renderSectionItem(item)}
                // getItemLayout={this.getItemLayout()}
                />
            </View>
        );
    }
}