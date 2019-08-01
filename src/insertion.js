import * as vscode from 'vscode';
import { parseHumanInput, timestamp } from './dateutil';
import { isSchedulingStatement, getCursorPosition } from './utils';
/**
 * USed to insert SCHEDULED and DEADLINE keywords
 * @param {String} keyword 
 */
export function insertWithUserTimestamp(keyword) {
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return;
	}
	let opts = { prompt: 'Enter schedule date' };
	let lineNumber = getCursorPosition().line;
	return vscode.window.showInputBox(opts).then(function (scheduleOn) {
		if (scheduleOn) {
			return parseHumanInput(scheduleOn);
		}
	}).then(d => {
		if(d) {
			insertTimestampedKeyword(lineNumber, keyword, d, false);
		}
	});
}
/**
 * insert a scheduling keyword and date at lineNumber. inserts a new line if the line is not yet a scheduing statement
 * @param {Number} lineNumber 
 * @param {String} keyword 
 * @param {import('moment').Moment} momentDate 
 * @param {boolean} ignoreInAgenda 
 */
export function insertTimestampedKeyword(lineNumber, keyword, momentDate, ignoreInAgenda=false) {
	let editor = vscode.window.activeTextEditor;
	let insertNewLine = !isSchedulingStatement(lineNumber);
	//TODO Append at end of line
	let toInsert = `${keyword}: ${timestamp(momentDate,ignoreInAgenda)}${insertNewLine?'\n':' '}`;
	let insertionPosition = new vscode.Position(lineNumber, 0);
	return editor.edit(edit => {
		edit.insert(insertionPosition, toInsert);
	});
}

