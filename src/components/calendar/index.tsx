import React from 'react';
import { SectionList, View, Text, TouchableWithoutFeedback } from 'react-native';
import sectionListGetItemLayout from '../common/sectionListGetItemLayout';
import {isFunction} from '../common/utils';
import { compareDate, getWeekOrderInMonth, changeFromTo } from './dataUtils';
import { CalendarCore, DataSourceModal, WeekGroup, DateModel } from './calendarCore';
import { Cell, CellProps } from './calendarCell';
import styles from './styles';

import type { SectionListRenderItemInfo } from 'react-native';

interface FromToModel {
    selectionStart: string;
    selectionEnd: string;
}

export type RenderCellProps = {
    date: string;
    day: number;
    holiday: string;
    isToday: boolean;
    disabled: boolean;
    dateText: string;
    isCheck: boolean;
    isCheckIn: boolean;
    isCheckOut: boolean;
    marking: any
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
    /**
     * markedDates
     * @param markedDates
     * 每个日期额外的标记
     */
    markedDates?: {
        [key: string]: {
            [markingkey: string]: any;
        };
    };
     /**
     * readerDate
     * 自定义每一个日期格的样式
     */
    renderDate?(day: RenderCellProps): JSX.Element;
    /**
     * onChange
     * @param fromTo FromToModel
     * 日期选择是回调
     */
    onChange?(fromTo: FromToModel): void;
    /**
     * Rendered at the very end of the list.
     */
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

interface CalendarState {
    monthData: DataSourceModal[],
    startDate: string;
    endDate: string;
}

const calendarCore = new CalendarCore;

export default class Calendar extends React.PureComponent<CalendarProps, CalendarState> {
    static get displayName() { return 'Calendar' };
    // 起始日期
    private selectionIn: string = this.props.selectionStart;
    // 结束日期
    private selectionOut: string = this.props.selectionEnd;

    private SectionListRef: SectionList;
    private itemHeight: number = 60;
    private checkInItemIndex: number = 0;
    private checkInSectionIndex: number = 0;

    start: number = Date.now();

    constructor(props: CalendarProps) {
        super(props);
        const { duration = 180, allowSelectionBeforeToday=false, selectionEnd, selectionStart } = props;
        // 先更新
        calendarCore.update({duration, allowSelectionBeforeToday});
        const [startDate, endDate] = changeFromTo(selectionStart, selectionEnd, allowSelectionBeforeToday);

        this.state = {
            monthData: calendarCore.getDateGroup(),
            startDate,
            endDate
        }
        console.log('初始数据耗时：', Date.now() - this.start);
    }

    static getDerivedStateFromProps(nextProps: CalendarProps, prevState: CalendarState) {
        const prevPorps = calendarCore.props;
        const { duration = 180, allowSelectionBeforeToday=false, selectionStart, selectionEnd } = nextProps;
        const { startDate, endDate } = prevState;

        const nextState: CalendarState = {} as CalendarState;
        if (
            JSON.stringify(duration) !== JSON.stringify(prevPorps.duration) ||
            allowSelectionBeforeToday !== prevPorps.allowSelectionBeforeToday
        ) {
            calendarCore.update({ duration, allowSelectionBeforeToday });
            nextState.monthData = calendarCore.getDateGroup();
        }

        if (startDate !== nextProps.selectionStart || endDate !== nextProps.selectionEnd) {
            [nextState.startDate, nextState.endDate] = changeFromTo(selectionStart, selectionEnd, allowSelectionBeforeToday);
        }

        if ('monthData' in nextState || 'startDate' in nextState || 'endDate' in nextState) {
            return nextState;
        }
        
        return null;
    }

    componentDidMount() {
        console.log('挂载耗时：', Date.now() - this.start);
        this._location();
    }

    componentDidUpdate(prevProps: CalendarProps) {
        if (prevProps.selectionStart !== this.props.selectionStart) {
            this._location();
        }
    }

    scrollIntoView(animated = false) {
        if (this.SectionListRef) {
            try {
                this.SectionListRef.scrollToLocation({
                    sectionIndex: this.checkInSectionIndex,
                    itemIndex: this.checkInItemIndex,
                    viewPosition: 0.5,
                    animated
                });
            } catch (error) {}
        }
    }

    private _location() {
        const { selectionStart } = this.props;
        this.checkInItemIndex = getWeekOrderInMonth(selectionStart);
        if (selectionStart) {
            const index = calendarCore.monthMap.findIndex(m => m === selectionStart.slice(0, 7));

            this.checkInSectionIndex = index === -1 ? 0 : index;
        }
    }

    private getItemLayout() {
        return sectionListGetItemLayout({
            getItemHeight: (_, __, ___) => this.itemHeight,
            getSectionHeaderHeight: () => 56, // The height of your section headers
            getSectionFooterHeight: () => 0, // The height of your section footers
            listHeaderHeight: 0,
        })
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
        const { selectionStartText, selectionEndText, markedDates = {}, renderDate } = this.props;
        const {startDate, endDate} = this.state;

        const { week } = section.item;

        return (
            <View
                style={styles.monthWeekGroup}
                onLayout={(e) => {
                    this.itemHeight = e.nativeEvent.layout.height || 60;
                }}
            >
                {week.map((item: DateModel, idx) => {
                    const { date, disabled } = item;
                    const marking = markedDates ? markedDates[date] : null;

                    const cellProps: CellProps = {
                        ...item,
                        selectionStart: startDate,
                        selectionEnd: endDate,
                        selectionStartText,
                        selectionEndText,
                        marking,
                        renderDate
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
                    ref={(sl) => {
                        this.SectionListRef = sl;
                    }}
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
                    getItemLayout={this.getItemLayout()}
                />
            </View>
        );
    }
}