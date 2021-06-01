export type DateModel = {
    date: string;
    day: number;
    isToday: boolean;
    disabled: boolean; 
    placeholder: boolean;
}

export type WeekGroup = {
    groupKey: string,
    sectionIndex: number,
    week: Array<DateModel> 
}

export type DataSourceModal = {
    title: string;
    data: Array<WeekGroup>;
};

/**
 * 将数字转成2个位数
 * @param num {number}
 * @returns {string}
 */
 export const convert2digit = (num: number | string): string => +num > 9 ? `${num}` : `0${num}`;

/**
 * getDateInfo 获取年、月、日、星期等信息
 * @param date {Date}
 * @returns {}
 */
export const getDateInfo = (date:Date = new Date()): {year: number, month: number, dateNum: number, day: number}=> ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    dateNum: date.getDate(),
    day: date.getDay()
});

export const isInvalidDate = (date: Date): boolean => (typeof date === 'object') && (`${date}` === 'Invalid Date');

/**
 * 
 * @param date {Date} 基准日期
 * @param days 天数
 */
export const getDateByDays = (date: Date = new Date(), days: number): Date => {
    const {year, month, dateNum} = getDateInfo(date);
    const innerdate = new Date(`${year}/${month}/${dateNum}`);
    const nextDate = new Date(innerdate.getTime() + days * 24 * 60 * 60 * 1000);
    return nextDate;
}

/**
 * compareDate 对比两个日期的大小
 * @param date1 {Date}
 * @param date2 {Date}
 * @return {Number} [相差的天数]
 */
export const compareDate = (date1: Date, date2: Date): boolean => date1.getTime() - date2.getTime() > 0;

/**
 * getFirstDayOfMonth 获取某年某月第一天
 * @param year {Number} 年份
 * @param month {Number} 月份 计算时会默认减1
 * @returns {Date}
 */
const getFirstDayOfMonth = (year: number, month: number): Date => new Date(year, month - 1, 1);

/**
 * getLastDayOfMonth 获取某年某月最后一天
 * @param year {Number}
 * @param month {Number}
 * @returns {Date}
 */
const getLastDayOfMonth = (year: number, month: number): Date => new Date(year, month, 0);

/**
 * getDateInfoArr 获取年、月、日、星期等信息
 * @param date {Date}
 * @returns {Array}
 */
const getDateInfoArr = (date: Date = new Date()): Array<number> => [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getDay()
];

/**
 * isToday 某年某月某天是否是今天
 * @param year {String}
 * @param month {String}
 * @param day {String}
 * @returns {Boolean}
 */
export const isToday = (
    year: string | number,
    month: string | number,
    day: string | number
): boolean => {
    const [todayYear, todayMonth, todayDateNum] = getDateInfoArr();
    return (
        todayYear === parseFloat(`${year}`) &&
        todayMonth === parseFloat(`${month}`) &&
        todayDateNum === parseFloat(`${day}`)
    );
}

function weekGroup<T extends any>(array: Array<T>, title: string, sectionIndex: number): {
    groupKey: string,
    sectionIndex: number,
    week: Array<T> 
}[] {
    let index = 0;
    
    let newArray: {
        groupKey: string,
        sectionIndex: number,
        week: Array<T> 
    } [] = [];

    while(index < array.length) {
        newArray.push({
            sectionIndex,
            groupKey: `${title}-week${index / 7}`,
            week: array.slice(index, index += 7)
        });
    }
    return newArray;
}

export const getDateMonthGroup = (start: Date, end: Date): DataSourceModal[] => {
    const monthList: DataSourceModal[] = [];

    const [startYear, startMonth] = getDateInfoArr(start);
    const [endYear, endMonth, endDateNum, endDay] = getDateInfoArr(end);
    const [todayYear, todayMonth, todayDateNum ] = getDateInfoArr();

    // 当月第一天的星期数
    let dayFirst = getFirstDayOfMonth(startYear, startMonth).getDay();

    // 循环判断时用
    let iYear = startYear, iMonth=startMonth;
    let sectionIndex = 0;
    let hasToday  = false;

    while(iYear < endYear || (iYear === endYear && iMonth <= endMonth)) {
        const isEnd: boolean = iYear === endYear && iMonth === endMonth;
        const tempDateObj: Date = getLastDayOfMonth(iYear, iMonth);

        // 当月第一天的星期数
        const dayLast: number = isEnd ? endDay : tempDateObj.getDay();
        // 某月的总天数
        const dayLength: number = isEnd ? endDateNum : tempDateObj.getDate();

        // 某月第一天之前的空格数
        const monthHeadArr: Array<DateModel> = new Array<DateModel>(dayFirst).fill({
            date: '',
            placeholder: true,
            day: 0,
            isToday: false,
            disabled: true
        });

        // 某月有效的日期
        const monthBodyArr: Array<DateModel> = new Array(dayLength).fill(1).map((_, day) => {
            const isToday = hasToday ? false : iYear === todayYear && iMonth === todayMonth && (day + 1) === todayDateNum;
            if (isToday) {
                hasToday = true;
            }
            return {
                date: `${iYear}-${convert2digit(iMonth)}-${convert2digit(day + 1)}`,
                placeholder: false,
                day: day + 1,
                isToday,
                disabled: hasToday ? false : true
            }
        });

        // 某月的最后一天之后的空格数
        const monthTailArr: Array<DateModel> = new Array<DateModel>(6 - dayLast).fill({
            placeholder: true,
            date: '',
            day: 0,
            isToday: false,
            disabled: true
        });

        const monthData: Array<DateModel> = [...monthHeadArr, ...monthBodyArr, ...monthTailArr];
        const title = `${iYear}-${iMonth}`;

        monthList.push({
            title: `${iYear}年${convert2digit(iMonth)}月`,
            data: weekGroup(monthData, title, sectionIndex++),
        });

        // 月份递增
        if (iMonth === 12) {
            iMonth = 1;
            iYear++;
        } else {
            iMonth++;
        }

        // 下月的第一天的星期为当月最后一天的星期加1
        dayFirst = (dayLast + 1) % 7;
    }

    return monthList;
}
