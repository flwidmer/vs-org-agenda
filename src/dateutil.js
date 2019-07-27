const moment = require('moment');
export {today, parseDate, formatHumanReadable, formatCanonical, timestamp, isBefore, addDays, parseHumanInput};

const DIGITS_WITH_PLUS = /\+\d+/;
const DIGITS = /\d+/;
const CANONICAL_DATE_FORMAT = 'YYYYMMDD';
const HuMAN_READABLE_DATE_FORMAT = 'dddd DD.MM.YYYY';
const TIMESTAMP_DATE_FORMAT = 'YYYY-MM-DD ddd';

function today() {
	return moment().startOf('day');
}

function parseDate(input) {
    return moment(input);
}

function parseHumanInput(input) {
    if(input.match(DIGITS_WITH_PLUS)) {
        return today().add(input, 'days');
    }
    if (input.length < 4 && input.match(DIGITS)) {
        let now = today();
        if(input > now.date()) {
            return now.date(input);
        } else {
            return now.add(1,'months').date(input);
        }
    }
    let parse = parseDate(input);
    if(parse.isValid()) {
        return parse;
    }
    
    return today();
}

/**
 * Format in a way that it makes sense as string (for sorting)
 */
function formatCanonical(momentDate) {
    return momentDate.format(CANONICAL_DATE_FORMAT);
};

/**
 * Format human readable.
 * TODO maybe later let the user configure this.
 */
function formatHumanReadable(momentDate) {
    return momentDate.format(HuMAN_READABLE_DATE_FORMAT);
}

function timestamp(input) {
    return `<${input.format(TIMESTAMP_DATE_FORMAT)}>`;
}

function isBefore(momentDateFirst, momentDateSecond) {
    return momentDateFirst.isBefore(momentDateSecond);
}

function addDays(momentDate, number) {
    return momentDate.add(number, 'days');
}