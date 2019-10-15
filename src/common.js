import * as vscode from 'vscode';

/**
 * This function will have to be removed and the content externalised in a file.
 * The file will need to be configurable.
 */
function createHeader() {
	return `<style>

	span.highlight-red {
		color: red;
	}

	span.highlight-orange {
		color: orange;
	}

	span.todo{
		background-color: red;
		
		color: #fff;
	}
	
	span.wait, span.project {
		background-color: purple;
	}
	
	span.done, span.cancelled {
		background-color: green;
		color: #fff;
	}
	
	.keyword {
	  margin-right: 10px;
	  border-radius: 5px;
	  padding: 4px;
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

export function createWebview(input, id, title) {

	// let reload = false;
	var fullAgendaView = vscode.window.createWebviewPanel(
	  id,
	  title,
	  vscode.ViewColumn.Beside,
	  {
		// Enable scripts in the webview
		enableScripts: false
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