import { isInvalidDate, getDateByDays, compareDate, getDateMonthGroup } from './dataUtils';
export class CalendarCore {
    constructor() {
        this.monthMap = [];
    }
    /**
     * 更新日期
     * @param props { CoreProps }
     */
    update(props) {
        const { duration } = props;
        if (Array.isArray(duration)) {
            const [start, end] = duration;
            this.startDate = new Date(start);
            this.endDate = new Date(end);
        }
        else {
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
    getDateGroup() {
        const { monthList, monthMap } = getDateMonthGroup(this.startDate, this.endDate, this.props.allowSelectionBeforeToday);
        this.monthMap = monthMap;
        return monthList;
    }
}
