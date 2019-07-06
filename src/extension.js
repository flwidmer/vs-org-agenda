import {traversePreview} from "./preview.js";
import {createAgendaView, filterHeadlines} from "./agenda.js";
import {createHeader} from "./common.js";

export{activate, deactivate};



// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const orga = require("orga");




// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	/**
	 * Open webview with current resource
	 */
	let disposable = vscode.commands.registerCommand('extension.vs-org-agenda.showCurrentfile', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user

		// var pathUri = vscode.Uri.file("c:/users/florian/git/notes/org/vmax.org");
		// var test = pathUri.toString();
		// var fileText = fs
		// 	.readFileSync(pathUri.fsPath)
		// 	.toString();

		let content = vscode.window.activeTextEditor.document.getText();
		
		var ast = orga.parse(content);
		
		var stack = []
		push(stack, ast.children);
		let view = traversePreview(stack);
		createWebview(view, "preview", "Org file preview");
		
	});
	context.subscriptions.push(disposable);

	let showAgendaCommand = vscode.commands.registerCommand('extension.vs-org-agenda.showAgenda', function () {
		//TODO get agenda files from configuration
		let config = vscode.workspace.getConfiguration("org-agenda")
		let files = config.agendaFiles;
		var headlines = []
		for (let i =  0; i < files.length; i++) {
			let pathUri = vscode.Uri.file(files[i]);
			let fileText = fs
				.readFileSync(pathUri.fsPath)
			 	.toString();
			let content = fileText.replace(/\r/g,"");
			var ast = orga.parse(content);
			filterHeadlines(headlines, ast.children);
		}
		
		let view = createAgendaView(headlines);
		createWebview(view, "agenda", "Agenda view");
		
	});

	context.subscriptions.push(showAgendaCommand);

	let showAgendaThisFile = vscode.commands.registerCommand('extension.vs-org-agenda.showAgendaThisFile', function () {
		//TODO get agenda files from configuration
		let content = vscode.window.activeTextEditor.document.getText();
		content = content.replace(/\r/g,"");
		var ast = orga.parse(content);
		
		var headlines = []
		filterHeadlines(headlines, ast.children);
		let view = createAgendaView(headlines);
		createWebview(view, "agenda", "Agenda view");
		
	});

	context.subscriptions.push(showAgendaThisFile);

	let addFileToAgenda = vscode.commands.registerCommand('extension.vs-org-agenda.addToAgenda', function () {
		//TODO get agenda files from configuration
		let config = vscode.workspace.getConfiguration("org-agenda")
		let files = config.agendaFiles;
		let fileName = vscode.window.activeTextEditor.document.fileName.replace(/\\/g,"/");
		if(!files.includes(fileName)) {
			files.push(fileName);
			vscode.workspace.getConfiguration().update("org-agenda.agendaFiles", files, vscode.ConfigurationTarget.Global);
		}
	});

	context.subscriptions.push(addFileToAgenda);
}


function push(stack, items) {
	Array.prototype.push.apply(stack, items);
}

function createWebview(input, id, title) {

	// let reload = false;
	var fullAgendaView = vscode.window.createWebviewPanel(
	  id,
	  title,
	  vscode.ViewColumn.Beside,
	  {
		// Enable scripts in the webview
		enableScripts: true
	  }
	);

	// Set The HTML content
	fullAgendaView.webview.html = createHeader() + input;

	//reload on save
	// vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
	//   reload = true;
	//   fullAgendaView.dispose();
	// });

	// fullAgendaView.onDidDispose(() => {
	//   if (reload === true) {
	// 	reload = false;
	// 	vscode.commands.executeCommand("extension.viewAgenda");
	//   }
	// });

	// Handle messages from the webview
	// fullAgendaView.webview.onDidReceiveMessage(message => {
	//   switch (message.command) {
	// 	case "open":
	// 	  let fullPath = path.join(setMainDir(), message.text);
	// 	  vscode.workspace.openTextDocument(vscode.Uri.file(fullPath)).then(doc => {
	// 		vscode.window.showTextDocument(doc, vscode.ViewColumn.One, false);
	// 	  });
	// 	  return;

	// 	case "changeTodo":
	// 	  let textArray = message.text.split(",");
	// 	  let fileName = path.join(setMainDir(), textArray[1]);
	// 	  let text = textArray[2];
	// 	  let contents = fs.readFileSync(fileName, "utf-8");
	// 	  let x = contents.split(/\r?\n/);

	// 	  for (let i = 0; i < x.length; i++) {
	// 		if (x[i].indexOf(text) > -1 && x[i].indexOf(textArray[3]) > -1) {
	// 		  let removeSchedule: any = x[i].match(/\bSCHEDULED\b(.*)/g);
	// 		  let date = moment().format('Do MMMM YYYY, h:mm:ss a');

	// 		  x[i] = x[i].replace(removeSchedule[0], "");
	// 		  x[i] = x[i].replace(
	// 			"TODO " + text,
	// 			"DONE " +
	// 			text +
	// 			"    SCHEDULED: " +
	// 			textArray[3] +
	// 			"\n   COMPLETED:" +
	// 			"[" +
	// 			date +
	// 			"]"
	// 		  );
	// 		  contents = x.join("\r\n");
	// 		  fs.writeFileSync(fileName, contents, "utf-8");
	// 		  return;
	// 		}
	// 	  }

	// 	case "changeDone":
	// 	  let textArrayD = message.text.split(",");
	// 	  let fileNameD = path.join(setMainDir(), textArrayD[1]);
	// 	  let textD = textArrayD[2];
	// 	  let contentsD = fs.readFileSync(fileNameD, "utf-8");
	// 	  let y = contentsD.split(/\r?\n/);

	// 	  for (let i = 0; i < y.length; i++) {
	// 		if (y[i].indexOf(textD) > -1 && y[i].indexOf(textArrayD[3]) > -1) {
	// 		  let removeSchedule: any = y[i].match(/\bSCHEDULED\b(.*)/g);
	// 		  y[i] = y[i].replace(removeSchedule[0], "");
	// 		  y[i] = y[i].replace("DONE " + textD, "TODO " + textD + "    SCHEDULED: " + textArrayD[3]);
	// 		  y.splice(i + 1, 1);
	// 		  contentsD = y.join("\r\n");
	// 		  fs.writeFileSync(fileNameD, contentsD, "utf-8");
	// 		  return;
	// 		}
	// 	  }
	//   }
	// });

  }

// this method is called when your extension is deactivated
function deactivate() {}






