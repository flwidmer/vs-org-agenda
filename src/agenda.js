export {traverseSchedule, filterHeadlines};
import {traversePreview, simpleOutput, } from "./preview.js";


var scheduleHandlers = { 
	"section": function () {
		let output = "<div class='section'>";
		output += traversePreview(this.children);
		output += "</div>";
		return output;
	},
	"headline": function () {
		let output =  ""; 
		output += "<li>"
		if(this.priority) {
			output += " " + this.priority + " ";
	   	} 
		if(this.keyword) {
			output += "<span class='keyword " + this.keyword.toLowerCase() + "'>";
			output += this.keyword;
			output += "</span>";
		}
		if (this.color) {
			output += "<span class='highlight-"+this.color+"'> ";
		}
		output += traversePreview(this.children.filter(node => node.type==="text"));
		if (this.color =="red") {
			output += " </span> ";
		}
		output += "</li>";
		output += traversePreview(this.children.filter(node => node.type!=="text"));
		return output;
	} ,
	"text": function() {
		return "<span>" + this.value + traversePreview(this.children)+ "</span>";
	},
	"paragraph": function() {
		return simpleOutput("p", this);
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
		output += traversePreview(this.children);
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
		output += traversePreview(this.children);
		output += "</li>";
		return output;
	},
	"table": function() {
		return simpleOutput("table", this);
	},
	"table.row": function() {
		return simpleOutput("tr", this);
	}, 
	"table.cell": function() {
		return simpleOutput("td", this);
	},
	"bold": function() {
		return simpleOutput("b", this);
	},
	"italic": function() {
		return simpleOutput("i", this);
	}
	//TODO include the rest of the nodes of the AST
	//TODO move this to its own module
};



function traverseSchedule(list) {
	let output = "";
	var i;
	for (i = 0; i < list.length; i++) {
		let node = list[i];
		if(scheduleHandlers[node.type]) {
			output += scheduleHandlers[node.type].call(node);
		}
	};
	return output;
}

function filterHeadlines(headlines, list) {
	var i;
	for (i = 0; i < list.length; i++) {
		if(list[i].type=="headline") {
			headlines.push(list[i]);
		}
		filterHeadlines(headlines,list[i].children);
	};
}