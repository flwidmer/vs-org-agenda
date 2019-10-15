
export const DATE_REGEX = /\d{4}-\d{1,2}-\d{1,2}/;
export const TIMESTAMP_REGEX = /([<\[][^\]>]*[\]>])/;
export const SCHEDULED_REGEX = /SCHEDULED: ([<\[][^\]>]*[\]>])/;
export const DEADLINE_REGEX = /DEADLINE: ([<\[][^\]>]*[\]>])/;
/**
 * Group 1 Level
 * Group 2 Keyword
 * Group 3 Priority
 * Group 4 Text
 * Group 5 Tags
 */
export const HEADLINE_REGEX = /^(\*+)\s(([A-Z]*)\s)?(\[\#[ABC]\])?\s*(.*?)(:[^:]+:)*$/;

//TODO load the keywords from configuration (or maybe even the org file)
const keywords = ['TODO', 'NEXT', 'PROJECT','WAIT','CANCELLED','DONE'];

/**
 * Regular expression to find keyword in a headline. It will be in group 1
 */
export function getKeywordInHeadlineRegex() {
    return new RegExp('^\\*+\\s('+keywords.join('|')+')\\s.*$');
}

export function getCompleteHeadlineRegexWithKeywords() {
    return new RegExp(`^(\\*+)\\s((${keywords.join('|')})\\s)?(\\[\#[ABC]\\])?\\s*(.*?)(:[^:]+:)*$`);
}