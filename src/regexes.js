
export const DATE_REGEX = /\d{4}-\d{1,2}-\d{1,2}/;
export const TIMESTAMP_REGEX = /([<\[][^\]>]*[\]>])/;
export const SCHEDULED_REGEX = /SCHEDULED: ([<\[][^\]>]*[\]>])/;
export const DEADLINE_REGEX = /DEADLINE: ([<\[][^\]>]*[\]>])/;
export const HEADLINE_REGEX = /^\*+\s([A-Z]*)\s*(\[\#[ABC]\])?\s*(.*)(:[^:]+:)*$/;

/**
 * Regular expression to find keyword in a headline. It will be in group 1
 */
export function getKeywordInHeadlineRegex() {
    //TODO load the keywords from configuration (or maybe even the org file)
    const keywords = ['TODO', 'NEXT', 'PROJECT','WAIT','CANCELLED','DONE'];
    return new RegExp('^\\*+\\s('+keywords.join('|')+')\\s.*$');
}