export {traverseSchedule, filterHeadlines, createAgendaView};
//TODO refactor out this dependency
import {traversePreview} from './preview.js';
import {today, parseDate, formatCanonical, formatHumanReadable, isBefore, addDays} from './dateutil.js';
import { emptyIfUndefined } from './utils.js';
import { DATE_REGEX, SCHEDULED_REGEX, DEADLINE_REGEX, TIMESTAMP_REGEX } from './regexes.js';


var scheduleHandlers = { 
	'section': function () {
		return `
			<div class="section">
				${traversePreview(this.children)}
			</div>`;
	},
	'headline': function () {
		return `
			<li>
				${emptyIfUndefined(this.priority)}
				${this.keyword?`<span class="keyword ${this.keyword.toLowerCase()}">${this.keyword}</span>`:''}
				${this.color?`<span class="highlight-${this.color}">`:''}
				${traversePreview(this.children.filter(node => node.type==='text'))}
				${this.color?'</span>':''}
			</li>
			<p><i>${emptyIfUndefined(this.planningText)}</i></p>
			<p><i>${createBreadCrumbs(this)}</i></p>
			${traversePreview(this.children.filter(node => node.type!=='text'))}`;
		
	} ,
	'text': function() {
		return '';
		// return `
		// 	<span>${this.value}${traversePreview(this.children)}</span>`;
	},
	'paragraph': function() {
		return `
			<p>${traversePreview(this.children)}</p>`;
	},
	'planning': function() {
		return `
			<p class="planning ${this.keyword.toLowerCase()}">
				<span class="keyword">${this.keyword}</span><span class="timestamp">${this.timestamp}</span>
			</p>`;
	},
	'bold': function() {
		return `
			<b>${traversePreview(this.children)}</b>`;
	},
	'italic': function() {
		return `
			<i>${traversePreview(this.children)}</i>`;
	}
	//TODO include the rest of the nodes of the AST
};



function traverseSchedule(list) {
	let output = '';
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
		if(list[i].type=='headline') {
			headlines.push(list[i]);
		}
		filterHeadlines(headlines,list[i].children);
	};
}

function createAgendaView(headlines) {
	var i,k;
		
	let dates ={};
	let dateList = [];

	
	for(i=0; i < headlines.length; i++) {
		let current = headlines[i];
		//TODO move to configuration, a "done" type
		if(current.keyword == 'DONE' || current.keyword == 'CANCELLED') {
			continue;
		}
		let pl = current.children.filter(e => e.type =='planning');
		if(pl.length == 0)  {
			continue;
		}
		
		let allPlanningItems = extractPlanningitems(pl[0]);
		for(k = 0; k < allPlanningItems.length; k++) {
			let planningItem = allPlanningItems[k];
			current.planning = planningItem.keyword;
			let d = DATE_REGEX.exec(planningItem.timestamp);
			current.date = parseDate(d[0]);
			if(current.planning == 'SCHEDULED' && isBefore(current.date, today())){
				current.date = today();
				current.planningText = `Scheduled since: ${planningItem.timestamp}`
			}
			if(current.planning == 'DEADLINE' && isBefore(current.date, addDays(today(),2))){
				current.color = 'orange';
				current.planningText = `Due on: ${planningItem.timestamp}`
			}
			if(current.planning == 'DEADLINE' && isBefore( current.date, today())){
				current.color = 'red';
				current.date = today();
				current.planningText = `Overdue since: ${planningItem.timestamp}`
			}
			
			if(dates[current.date]) {
				dates[current.date].push(current);
			} else {
				dates[current.date] = [current];
				dateList.push(current.date);
			}
		}
	}

	// sort by date
	dateList.sort((a,b) => formatCanonical(a) - formatCanonical(b));

	//html output (yeah it could use improvement)
	let view = '';
	for(i = 0; i < dateList.length; i++) {
		view += '<h1>'+ formatHumanReadable(dateList[i]) + '</h1>';
		view += '<ul>';
		view += traverseSchedule(dates[dateList[i]]);
		view += '</ul>';
	}
	return view;
}

function extractPlanningitems(item) {
	let additionalItems = [item];
	let text = item.timestamp;
	if(text.match(SCHEDULED_REGEX)) {
		let scheduled = SCHEDULED_REGEX.exec(text);
		additionalItems.push(createNode('SCHEDULED', scheduled[1], item));
		text = text.replace(SCHEDULED_REGEX,'');
	}
	if(text.match(DEADLINE_REGEX)) {
		let deadline = DEADLINE_REGEX.exec(text);
		additionalItems.push(createNode('DEADLINE', deadline[1], item));
		text = text.replace(SCHEDULED_REGEX,'');
	}
	let ts = TIMESTAMP_REGEX.exec(text);
	item.timestamp = ts[0];
	return additionalItems;
}

function createNode(keyword, timestamp, parent) {
	return  {	
		type: 'planning',
		children:[],
		parent: parent.parent,
		keyword: keyword,
		timestamp: timestamp
	};
}

function createBreadCrumbs(node) {
	let items = [];
	if(node) {
		traverseUpwards(node.parent, node.level, t => items.push(t));
	}
	return items.reverse().join(' &gt; ');
}
/**
 * Recursive to traverse headlines
 * The trick is, that a headline is a child of a section and 
 * the parent headline is a sibling of the container section.
 */
function traverseUpwards(start, level, outputFunction) {
	if(!start || level == 1) {
		return;
	}
	if(start.type == 'section') {
		// Filter in such a way that the level is lower (higher in the hierarchy)
		let headlines = start.children.filter(c => c.type == 'headline' && c.level < level);
		if(headlines.length > 0) {
			let headline = headlines[0];
			let texts = headline.children.filter(c => c.type == 'text');
			if(texts.length > 0) {
				outputFunction(texts[0].value);
			}
		}
	}
	traverseUpwards(start.parent, start.level, outputFunction);
}