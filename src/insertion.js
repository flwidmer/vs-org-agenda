import * as vscode from 'vscode';
import { parseHumanInput, timestamp } from './dateutil';

export function insertWithTimestamp(keyword) {
    let editor = vscode.window.activeTextEditor;
		if(!editor) {
			return;
		}
		let pos = editor.selection.active;
		let opts = { prompt: 'Enter schedule date'};
		vscode.window.showInputBox(opts).then(function (scheduleOn) {
			if(scheduleOn) {
				let text= timestamp(parseHumanInput(scheduleOn));
				editor.edit(edit => {
					edit.insert(pos, `${keyword}: ${text}`);
				});
			}
		});
}

