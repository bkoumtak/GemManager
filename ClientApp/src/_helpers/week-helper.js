import moment from 'moment';

export function getWeekSince() {
    const startDate = "2020-01-07"; 
    var today = moment();
    console.log(date); 
    var startDate = moment(date);

    return today.diff(startDate, 'week');
}