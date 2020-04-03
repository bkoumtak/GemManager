import moment from 'moment';

export function getWeekSince() {
    const startDate = "2020-01-06"; 
    var today = moment(); 
    var beginning = moment(startDate);

    return today.diff(beginning, 'week');
}

export function getTimeToDisplay(week) {
    const startDate = "2020-01-06"; 
    var dateToDisplay = moment(startDate).add(week, 'weeks').add(4, 'days'); 
    var timeToDisplay = dateToDisplay.add(16, 'hours'); 
    return timeToDisplay; 
}

export function getNow() {
    return moment();
}