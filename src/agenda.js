export {traverseSchedule, filterHeadlines};
//TODO remove this dependency
import {traversePreview} from "./preview.js";


var scheduleHandlers = { 
	"section": function () {
		return `
			<div class='section'>
				${traversePreview(this.children)}
			</div>`;
	},
	"headline": function () {
		return `
			<li>
				${this.priority?this.priority:" "}
				${this.keyword?`<span class='keyword ${this.keyword.toLowerCase()}'>${this.keyword}</span>`:""}
				${this.color?`<span class='highlight-${this.color}'>`:""}
				${traversePreview(this.children.filter(node => node.type==="text"))}
				${this.color?`</span>`:""}
			</li>
			${traversePreview(this.children.filter(node => node.type!=="text"))}`;
		
	} ,
	"text": function() {
		return `
			<span>${this.value}${traversePreview(this.children)}</span>`;
	},
	"paragraph": function() {
		return `
			<p>${traversePreview(this.children)}</p>`;
	},
	"planning": function() {
		return `
			<p class='planning ${this.keyword.toLowerCase()}'>
				<span class='keyword'>${this.keyword}</span><span class='timestamp'>${this.timestamp}</span>
			</p>`;
	},
	"bold": function() {
		return `
			<b>${traversePreview(this.children)}</b>`;
	},
	"italic": function() {
		return `
			<i>${traversePreview(this.children)}</i>`;
	}
	//TODO include the rest of the nodes of the AST
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