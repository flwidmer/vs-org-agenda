const moment = require("moment");

export {today, parseDate, formatHumanReadable, formatCanonical, timestamp, isBefore, addDays, parseHumanInput};

function today() {
	return moment().startOf("day");
}

function parseDate(input) {
    return moment(input);
}

function parseHumanInput(input) {
    if(input.match(/\+\d+/)) {
        return today().add(input, "days");
    }
    if (input.length < 4 && input.match(/\d+/)) {
        let now = today();
        if(input > now.date()) {
            return now.date(input);
        } else {
            return now.add(1,"months").date(input);
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
    return momentDate.format('YYYYMMDD');
};

/**
 * Format human readable.
 * TODO maybe later let the user configure this.
 */
function formatHumanReadable(momentDate) {
    return momentDate.format("dddd DD.MM.YYYY");
}

function timestamp(input) {
    return `<${input.format("YYYY-MM-DD ddd")}>`;
}

function isBefore(momentDateFirst, momentDateSecond) {
    return momentDateFirst.isBefore(momentDateSecond);
}

function addDays(momentDate, number) {
    return momentDate.add(number, 'days');
}