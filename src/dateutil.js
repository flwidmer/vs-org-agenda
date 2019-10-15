import * as moment from 'moment';

const DIGITS_WITH_PLUS = /\+\d+/;
const DIGITS = /\d+/;
const CANONICAL_DATE_FORMAT = 'YYYYMMDD';
const HuMAN_READABLE_DATE_FORMAT = 'dddd DD.MM.YYYY';
const TIMESTAMP_DATE_FORMAT = 'YYYY-MM-DD ddd';

const TIMESTAMP_FORMAT = TIMESTAMP_DATE_FORMAT + ' hh24:mm:ss';

export function today() {
	return moment().startOf('day');
}

export function timestampNow() {
    return moment().format(TIMESTAMP_FORMAT);
}

export function parseDate(input) {
    return moment(input);
}

export function parseHumanInput(input) {
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
export function formatCanonical(momentDate) {
    return momentDate.format(CANONICAL_DATE_FORMAT);
};

/**
 * Format human readable.
 * TODO maybe later let the user configure this.
 */
export function formatHumanReadable(momentDate) {
    return momentDate.format(HuMAN_READABLE_DATE_FORMAT);
}

export function timestamp(input, ignoreInAgenda) {
    return `${ignoreInAgenda?'[':'<'}${input.format(TIMESTAMP_DATE_FORMAT)}${ignoreInAgenda?']':'>'}`;
}

export function isBefore(momentDateFirst, momentDateSecond) {
    return momentDateFirst.isBefore(momentDateSecond);
}

export function addDays(momentDate, number) {
    return momentDate.add(number, 'days');
}