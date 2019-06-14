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
		let view = traverse(stack);
		createWebview(view);
		
	});

	context.subscriptions.push(disposable);
}

function push(stack, items) {
	Array.prototype.push.apply(stack, items);
}

var handlers = { 
	"section": function () {
		let output = "<div class='section'>";
		output += traverse(this.children);
		output += "</div>";
		return output;
	},
	"headline": function () {
		let output =  ""; 
		output += "<h" + this.level;
		output += " class='";
		if(this.keyword) {
			 output += " " + this.keyword + " ";
		} 
		if(this.priority) {
			output += " " + this.priority + " ";
	   	} 
		output += "'>";
		if(this.keyword) {
			output += "<span class='keyword " + this.keyword.toLowerCase() + "'>";
			output += this.keyword;
			output += "</span>";
		}
		output += traverse(this.children.filter(node => node.type==="text"));
		output += "</h" + this.level + ">";
		output += "<div class='headline-properties level" +this.level +"'>"; 
		output += traverse(this.children.filter(node => node.type!=="text"));
		output += "</div>";
		return output;
	} ,
	"text": function() {
		return "<span>" + this.value + traverse(this.children)+ "</span>";
	},
	"paragraph": function() {
		let output = "<p>";
		output += traverse(this.children);
		output += "</p>";
		return output;
	},
	"planning": function() {
		let output = "<p class='planning ";
		output += " "+ this.keyword.toLowerCase()+"'>";
		output += "<span class='keyword>"+this.keyword + "</span><span class='timestamp'>" + this.timestamp;
		output += "</span></p>"
		return output;
	},
	"list": function() {
		let output ="<div class='list'>";
		if(this.ordered) {
			output += "<ol>";
		}else {
			output += "<ul>";
		}
		output += traverse(this.children);
		if(this.ordered) {
			output += "</ol>";
		}else {
			output += "</ul>";
		}
		return output;
	},
	"list.item": function() {
		let output ="<li>";
		if(this.checked) {
			output+="<input checked  type='checkbox' />";
		} else if (this.checked === false) {
			output+="<input  type='checkbox' />";
		}
		output += traverse(this.children);
		output += "</li>";
		return output;
	},
	"table": function() {
		let output ="<table>";
		output += traverse(this.children);
		output += "</table>";
		return output;
	},
	"table.row": function() {
		let output ="<tr>";
		output += traverse(this.children);
		output += "</tr>";
		return output;
	}, 
	"table.cell": function() {
		let output ="<td>";
		output += traverse(this.children);
		output += "</td>";
		return output;
	}
};

function traverse(list) {
	let output = "";
	var i;
	for (i = 0; i < list.length; i++) {
		let node = list[i];
		if(handlers[node.type]) {
			output += handlers[node.type].call(node);
		}
	};
	return output;
}

/**
 * This funciton will have to be removed and the content externalised in a file.
 * The file will need to be configurable.
 */
function createHeader() {
	return `<style>


	span.todo{
		background-color: #f29f97;
		padding: 0px 4px;
		color: #fff;
	}
	
	span.wait, span.project {
		background-color: #6AB097;
	}
	
	span.done, span.cancelled {
		background-color: #6ab0de;
		padding: 0px 4px;
		color: #fff;
	}
	
	.keyword {
	  margin-right: 10px;
	}
	
	.section-number {
	  display: none;
	}
	
	span.tag {
		background-color: #EDEDED;
		border: 1px solid #EDEDED;
		color: #939393;
		cursor: pointer;
		display: block;
		float: right;
		font-size: 80%;
		font-weight: normal;
		margin: 0 3px;
		padding: 1px 2px;
		border-radius: 10px;
	}
	
	table{
		border-collapse:collapse;
		border-spacing:0;
		empty-cells:show;
		margin-bottom:24px;
		border-bottom:1px solid #e1e4e5;
	}
	
	td{
		vertical-align:top}
	
	table td,table th{
		font-size:90%;
		margin:0;
		overflow:visible;
		padding:8px 16px;
		border:1px solid #e1e4e5;
	}
	
	table thead th{
		font-weight:bold;
		border-top:3px solid #e1e4e5;
		border-bottom:1px solid #e1e4e5;
	}
	
	table caption{
		color:#000;
		font:italic 85%/1 arial,sans-serif;
		padding:1em 0;
	}
	
	table tr:nth-child(2n-1) td{
		
	}
	
	table tr:nth-child(2n) td{
		
	}
	
	</style>`;
}

function createWebview(input) {

	// let reload = false;
	var fullAgendaView = vscode.window.createWebviewPanel(
	  "fullAgenda",
	  "Full Agenda View",
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




exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
