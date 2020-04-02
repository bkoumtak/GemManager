import moment from 'moment';

export function getWeekSince() {
    const startDate = "2020-01-06"; 
    var today = moment(); 
    var beginning = moment(startDate);

    return today.diff(beginning, 'week');
}

export function getTimeToDisplay(week) {
    const startDate = "2020-01-06"; 
    var currentDate = moment(startDate).add(week, 'weeks'); 
    var currentTime = currentDate.add(16, 'hours'); 
    return currentTime; 
}

export function getNow() {
    return moment();
}