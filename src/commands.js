import {traversePreview} from './preview.js';
import {createAgendaView, filterHeadlines} from './agenda.js';
import { insertWithUserTimestamp, insertTimestampedKeyword } from './insertion.js';
import { getHeadlinePosition, changeKeyword } from './headlines';
import { today } from './dateutil.js';
import { createWebview } from './common.js';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as orga from 'orga';
import { push } from './utils.js';

export function commandPreviewFile() {
    let content = vscode.window.activeTextEditor.document.getText();
    
    var ast = orga.parse(content);
    
    var stack = []
    push(stack, ast.children);
    let view = traversePreview(stack);
    createWebview(view, 'preview', 'Org file preview');
    
}

export function commandShowAgenda() {
    let config = getConfiguration()
    let files = config.agendaFiles;
    var headlines = []
    for (let i =  0; i < files.length; i++) {
        let pathUri = vscode.Uri.file(files[i]);
        let fileText = fs
            .readFileSync(pathUri.fsPath)
             .toString();
        let content = fileText.replace(/\r/g,'');
        var ast = orga.parse(content);
        filterHeadlines(headlines, ast.children);
    }
    
    let view = createAgendaView(headlines);
    createWebview(view, 'agenda', 'Agenda view');
    
}

function getConfiguration() {
    return vscode.workspace.getConfiguration('org-agenda');
}

export function commandShowAgendaThisFile() {
    let content = vscode.window.activeTextEditor.document.getText();
    content = content.replace(/\r/g,'');
    var ast = orga.parse(content);
    
    var headlines = []
    filterHeadlines(headlines, ast.children);
    let view = createAgendaView(headlines);
    createWebview(view, 'agenda', 'Agenda view');
    
}

export function commandAddFileToAgenda () {
    let config = vscode.workspace.getConfiguration('org-agenda')
    let files = config.agendaFiles;
    let fileName = vscode.window.activeTextEditor.document.fileName.replace(/\\/g,'/');
    if(!files.includes(fileName)) {
        files.push(fileName);
        vscode.workspace.getConfiguration().update('org-agenda.agendaFiles', files, vscode.ConfigurationTarget.Global);
    }
}

export function commandSchedule () {
    insertWithUserTimestamp('SCHEDULED');
}

export function commandDeadline() {
    insertWithUserTimestamp('DEADLINE');
}

export function commandChangeTodoState() {
    let opts = {
        prompt: 'Please select state',
        canPickMany: false
    }
    let availableStates = getConfiguration().stateKeywords;
    let doneStates = getConfiguration().doneStates;
    return vscode.window.showQuickPick(availableStates, opts).then(function (pickedItem) {
		if (pickedItem) {
			let lineNumber = getHeadlinePosition();
            return changeKeyword(lineNumber, pickedItem)
                .then(() =>{
                    if(doneStates.some(s => s === pickedItem)) {
                        insertTimestampedKeyword(lineNumber + 1, 'CLOSED', today(), true);
                    }
                });
		}
	});
}