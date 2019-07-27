import * as vscode from 'vscode';
export {getCursorPosition,getActiveTextEditor,getLine,emptyIfUndefined}


function getCursorPosition() {
    let curEditor = vscode.window.activeTextEditor;
    return curEditor.selection.active;
}


function getActiveTextEditor() {
    return vscode.window.activeTextEditor.document;
}

function getLine() {
    return getActiveTextEditor().lineAt(getCursorPosition());
}

function emptyIfUndefined(text) {
    return text?text:'';
}