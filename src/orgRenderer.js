import { leftPadIfDefined, applyIfDefined } from "./utils";

const orgHandlers = {
    'root': function () {
        return `${renderOrg(this.children)}`;
    },
    'section': function () {
        return `${renderOrg(this.children)}`;
    },
    'headline': function () {
        let r = `${createLevel(this.level)}${leftPadIfDefined(this.keyword)}${applyIfDefined(this.tags, t => t.map(e => ':' + e + ':').join(' '))}${applyIfDefined(this.priority, t => ` #${t}`)} ${renderOrg(this.children.filter(node => node.type === 'text'))}`;
        return r;
    },
    'text': function () {
        return `${this.value}`;
    },
    // 'paragraph': function() {
    // 	return `
    // 		<p>${renderOrg(this.children)}</p>`;
    // },
    // 'planning': function() {
    // 	return `
    // 		<p class="planning ${this.keyword.toLowerCase()}">
    // 			<span class="keyword">${this.keyword}</span><span class="timestamp">${this.timestamp}</span>
    // 		</p>`;
    // },
    // 'list': function() {
    // 	return `
    // 		<div class='list'>
    // 		${this.ordered?'<ol>':'<ul>'}
    // 			${renderOrg(this.children)}
    // 		${this.ordered?'</ol>':'</ul>'}
    // 		</div>`;
    // },
    // 'list.item': function() {
    // 	return `
    // 		<li>
    // 			${(this.checked != undefined)?`<input type="checkbox" ${this.checked?'checked':''} />`:''}
    // 			${renderOrg(this.children)}
    // 		</li>`;
    // },
    // 'table': function() {
    // 	return `<table>${renderOrg(this.children)}</table>`;
    // },
    // 'table.row': function() {
    // 	return `<tr>${renderOrg(this.children)}</tr>`;
    // }, 
    // 'table.cell': function() {
    // 	return `<td>${renderOrg(this.children)}</td>`;
    // },
    // 'bold': function() {
    // 	return `<b>${renderOrg(this.children)}</b>`;
    // },
    // 'italic': function() {
    // 	return `<i>${renderOrg(this.children)}</i>`;
    // }
    //TODO include the rest of the nodes of the AST
};

export function renderOrg(list) {
    if (!list.length) {
        list = [list];
    }
    let output = '';
    var i;
    for (i = 0; i < list.length; i++) {
        let node = list[i];
        if (orgHandlers[node.type]) {
            output += orgHandlers[node.type].call(node);
        }
    };
    return output;
}

function createLevel(level) {
    let l = '';
    for (let i = 0; i < level; i++) {
        l = l + '*';
    }
    return l;
}