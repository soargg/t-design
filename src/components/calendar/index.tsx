import React from 'react';
import { SectionList, View, Text } from 'react-native';
import {CalendarCore, DataSourceModal, WeekGroup, DateModel} from './calendarCore';
import { Cell, CellProps } from './calendarCell';
import styles from './styles';

import type { SectionListRenderItemInfo } from 'react-native';

interface CalendarProps {
    duration?: number | [string, string],
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

interface CalendarState {
    beginDate: Date,
    monthData: DataSourceModal[]
}

const calendarCore = new CalendarCore;

export default class Calendar extends React.PureComponent<CalendarProps, CalendarState> {

    constructor(props: CalendarProps) {
        super(props);
        const { duration=120 } = props;
        calendarCore.update(duration);
        this.state = {
            monthData: calendarCore.getDateGroup(),
            beginDate: calendarCore.startDate
        }
    }

    private renderSectionItem(section: SectionListRenderItemInfo<WeekGroup>): JSX.Element {
        const { week } = section.item;

        return (
            <View style={styles.monthWeekGroup}>
                {week.map((item: DateModel, idx) => {
                    const {date} = item;
                    const cellProps: CellProps = {
                        ...item
                    };
                    return (
                        <View
                            key={`${date}_${idx}`}
                            style={styles.dateCell}
                            collapsable={false}
                        >
                            <Cell {...cellProps} />
                        </View>
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
                    style={{paddingHorizontal: 15}}
                    sections={this.state.monthData}
                    stickySectionHeadersEnabled={false}
                    keyExtractor={(item: WeekGroup) => item.groupKey}
                    renderSectionHeader={({section: {title}}) => (
                        <Text style={styles.monthTitle}>{title}</Text>
                    )}
                    ListFooterComponent={ ListFooterComponent }
                    renderItem={(item) => this.renderSectionItem(item)}
                    // getItemLayout={this.getItemLayout()}
                />
            </View>
        );
    }
}