import * as vscode from 'vscode';
export {getCursorPosition,getActiveTextEditor,getLine}


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
