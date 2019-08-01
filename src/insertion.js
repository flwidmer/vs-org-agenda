import * as vscode from 'vscode';
import * as dateutil from './dateutil';
import * as util from './utils';
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
	let lineNumber = util.getCursorPosition().line;
	return vscode.window.showInputBox(opts).then(function (scheduleOn) {
		if (scheduleOn) {
			return dateutil.parseHumanInput(scheduleOn);
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
	let insertNewLine = !util.isSchedulingStatement(lineNumber);
	//TODO Append at end of line
	let toInsert = `${keyword}: ${dateutil.timestamp(momentDate,ignoreInAgenda)}${insertNewLine?'\n':' '}`;
	let insertionPosition = new vscode.Position(lineNumber, 0);
	return editor.edit(edit => {
		edit.insert(insertionPosition, toInsert);
	});
}

