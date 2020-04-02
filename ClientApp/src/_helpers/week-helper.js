import moment from 'moment';

export function getWeekSince() {
    const startDate = "2020-01-06"; 
    var today = moment(); 
    var beginning = moment(startDate);

    return today.diff(beginning, 'week');
}

export function getTimeToDisplay(week) {
    const startDate = "2020-01-06"; 
    var weekFinishDate = moment(startDate).add(week, 'weeks').add(4, 'days'); 
    var weekFinishTime = weekFinishDate.add(15, 'hours'); 
    return weekFinishTime; 
}

export function getNow() {
    return moment();
}