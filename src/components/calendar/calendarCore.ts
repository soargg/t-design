import {
    isInvalidDate,
    getDateByDays,
    compareDate,
    getDateMonthGroup,
    DataSourceModal,
    WeekGroup,
    DateModel
} from './dataUtils';

type CoreProps = {
    duration: number | [string, string];
    allowSelectionBeforeToday: boolean;
}

export { DataSourceModal, WeekGroup, DateModel };

export class CalendarCore {
    props: CoreProps;
    // 起始日期
    startDate: Date;
    endDate: Date;
    // private dataSource: DataSourceModal[];
    
    // constructor(props: Props) {
    //     this.update(props);
    // }

    /**
     * 更新日期
     * @param props { CoreProps }
     */
    update(props: CoreProps) {
        const { duration, allowSelectionBeforeToday } = props;

        if (Array.isArray(duration)) {
            const [start, end] = duration; 
            this.startDate = new Date(start);
            this.endDate = new Date(end);
        } else {
            this.startDate = new Date();
            this.endDate = getDateByDays(this.startDate, duration);
        }

        if (isInvalidDate(this.startDate) || isInvalidDate(this.endDate)) {
            console.warn('Invalid Date in duration');
            this.startDate = new Date();
            this.endDate = getDateByDays(this.startDate, 120);
        }

        // 交换入离日期
        if (compareDate(this.startDate, this.endDate)) {
            [this.startDate, this.endDate] = [this.endDate, this.startDate];
        }

        this.props = props;
    }

    getDateGroup(): DataSourceModal[] {
        return getDateMonthGroup(this.startDate, this.endDate, this.props.allowSelectionBeforeToday);
    }
}