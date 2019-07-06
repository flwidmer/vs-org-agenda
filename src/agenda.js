const moment = require("moment");

export {traverseSchedule, filterHeadlines, createAgendaView};
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

function createAgendaView(headlines) {
	var i;
		var scheduled = [];
		var deadline = [];
		var appointements = [];
		var dateRegex = /\d{4}-\d{1,2}-\d{1,2}/
		let dates ={};
		let dateList = [];

		
		for(i=0; i < headlines.length; i++) {
			let current = headlines[i];
			if(current.keyword == "DONE" || current.keyword == "CANCELLED") {
				continue;
			}
			let pl = current.children.filter(e => e.type =="planning");
			if(pl.length == 0)  {
				continue;
			}
			//TODO replicate items as necessary to accommodate several of them,
			let planningItem = pl[0];
			if(planningItem.keyword == "DEADLINE") {
				deadline.push(current);
			} else if (planningItem.keyword == "SCHEDULED") {
				scheduled.push(current);
			
			}
			current.planning = planningItem.keyword;
			let d = dateRegex.exec(planningItem.timestamp);
			current.date = moment(d[0]);
			if(current.planning == "SCHEDULED" && current.date.isBefore(today())){
				current.date = moment().startOf("day");
			}
			if(current.planning == "DEADLINE" && current.date.isBefore(today().add(2, "days"))){
				current.color = "orange";
			}
			if(current.planning == "DEADLINE" && current.date.isBefore(today())){
				current.color = "red";
				current.date = moment().startOf("day");
			}
			if(dates[current.date]) {
				dates[current.date].push(current);
			} else {
				dates[current.date] = [current];
				dateList.push(current.date);
			}
		}

		//TODO sort by date
		dateList.sort((a,b) => a.format('YYYYMMDD') - b.format('YYYYMMDD'))

		//TODO do html output
		let view = "";
		for(i = 0; i < dateList.length; i++) {
			view += "<h1>"+ dateList[i].format("dddd DD.MM.YYYY") + "</h1>";
			view += "<ul>";
			view += traverseSchedule(dates[dateList[i]]);
			view += "</ul>";
		}
		return view;
}


function today() {
	return moment().startOf("day");
}