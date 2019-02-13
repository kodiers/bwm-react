import titleize from 'titleize';
import * as moment from 'moment';


export const rentalType = (isShared) => {
    return isShared ? 'shared': 'entire';
};

export const toUpperCase = (value) => {
    return value ? titleize(value) : '';
};

export const getRangeOfDates = (startAt, endAt, dateFormat='Y/MM/DD') => {
    const tempDates = [];
    const mEndAt = moment(endAt);
    let mStartAt = moment(startAt);
    while (mStartAt < mEndAt) {
        tempDates.push(mStartAt.format(dateFormat));
        mStartAt = mStartAt.add(1, 'day');
    }
    tempDates.push(mEndAt.format(dateFormat));
    return tempDates;
};

export const pretifyDate = date => moment(date).format('MMM Do YY');

export const isExpired = (date) => {
    const dateNow = moment();
    const dateM = moment(date);
    return dateM.isBefore(dateNow);
};
