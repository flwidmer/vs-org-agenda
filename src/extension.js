
import * as commands from "./commands.js";

export{activate, deactivate};



// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');





// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	/**
	 * Open webview with current resource
	 */
	let previewFile = vscode.commands.registerCommand('extension.vs-org-agenda.showCurrentfile', commands.commandPreviewFile);
	context.subscriptions.push(previewFile);

	let showAgenda = vscode.commands.registerCommand('extension.vs-org-agenda.showAgenda', commands.commandShowAgenda);
	context.subscriptions.push(showAgenda);

	let showAgendaThisFile = vscode.commands.registerCommand('extension.vs-org-agenda.showAgendaThisFile', commands.commandShowAgendaThisFile);
	context.subscriptions.push(showAgendaThisFile);

	let addFileToAgenda = vscode.commands.registerCommand('extension.vs-org-agenda.addToAgenda', commands.commandAddFileToAgenda );
	context.subscriptions.push(addFileToAgenda);

	let schedule = vscode.commands.registerCommand('extension.vs-org-agenda.schedule', commands.commandSchedule);
	context.subscriptions.push(schedule);

	let deadline = vscode.commands.registerCommand('extension.vs-org-agenda.deadline', commands.commandDeadline);
	context.subscriptions.push(deadline);

	let changeState = vscode.commands.registerCommand('extension.vs-org-agenda.changeState', commands.commandChangeTodoState);
	context.subscriptions.push(changeState);
}


// this method is called when your extension is deactivated
function deactivate() {}






