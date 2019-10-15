import * as vscode from 'vscode';
import { TIMESTAMP_REGEX } from './regexes';


export function isSchedulingStatement(lineNumber) {
    let line = getActiveTextEditor().lineAt(lineNumber);
    //TODO make configurable
    return TIMESTAMP_REGEX.test(line.text);
}


export function getCursorPosition() {
    let curEditor = vscode.window.activeTextEditor;
    return curEditor.selection.active;
}

export function getActiveTextEditor() {
    return vscode.window.activeTextEditor.document;
}

export function createTextEditor() {
    
}

export function getActiveFileName() {
    return vscode.window.activeTextEditor.document.uri.fsPath;
}

export function getLine() {
    return getActiveTextEditor().lineAt(getCursorPosition());
}

export function emptyIfUndefined(text) {
    return text ? text : '';
}

export function leftPadIfDefined(text) {
    return !isEmpty(text) ? ' ' + text : '';
}

export function applyIfDefined(text, func) {
    return !isEmpty(text)?func(text):'';
}

function isEmpty(text) {
    if(!text) {
        return true;
    } else if(text === '') {
        return true;
    } else {
        return false;
    }
}

export function push(stack, items) {
	Array.prototype.push.apply(stack, items);
}


/**
 * 
 * @param {string} content 
 */
export function splitIntoLines(content) {
    return content.split('\n');
}