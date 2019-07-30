import * as vscode from 'vscode';
import { getActiveTextEditor, getLine } from './utils';
import { renderOrg } from './orgRenderer';
import { parseOrgaAst, dfsOnAst } from './orgaAdapter';
import { HEADLINE_REGEX } from './regexes';

/**
 * Returns position of headline above. if it can find one
 * @returns lineNumber
 */
export function getHeadlinePosition() {
    let editor = getActiveTextEditor();
    let line = getLine();
    let currentPosition = line.lineNumber;
    //Move up until headline is found
    while (currentPosition != 0 && !HEADLINE_REGEX.exec(line.text)) {
        currentPosition--;
        line = editor.lineAt(currentPosition);
    }
    return line.lineNumber;
}

export function changeKeyword(lineNumber, newKeyword) {
    let editor = vscode.window.activeTextEditor
    let line = editor.document.lineAt(lineNumber);
    let headlineAst = parseOrgaAst(line.text);
    dfsOnAst(headlineAst, n => {
        if (n.type === 'headline') {
            n.keyword = newKeyword;
            return false;
        } else {
            return true;
        }
    });
    let rendered = renderOrg(headlineAst);
    // let keyword = regex.exec(line.text)[1];
    return editor.edit(edit => {
        edit.replace(line.range, rendered);
    });
}


