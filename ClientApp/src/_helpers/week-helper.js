import moment from 'moment';

export function getWeekSince() {
    const startDate = "2020-01-07"; 
    var today = moment(); 
    var beginning = moment(startDate);

    return today.diff(beginning, 'week');
}