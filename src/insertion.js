import * as vscode from 'vscode';
import { parseHumanInput, timestamp } from './dateutil';
import { isSchedulingStatement, getCursorPosition } from './utils';


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
			insertTimestampedKeyword(lineNumber, keyword, d);
		}
	});
}

export function insertTimestampedKeyword(lineNumber, keyword, momentDate) {
	let editor = vscode.window.activeTextEditor;
	let insertNewLine = !isSchedulingStatement(lineNumber);
	//TODO Append at end of line
	let toInsert = `${keyword}: ${timestamp(momentDate)}${insertNewLine?'\n':' '}`;
	let insertionPosition = new vscode.Position(lineNumber, 0);
	return editor.edit(edit => {
		edit.insert(insertionPosition, toInsert);
	});
}

