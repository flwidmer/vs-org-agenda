
export function traversePreview(list) {
	let output = '';
	var i;
	for (i = 0; i < list.length; i++) {
		let node = list[i];
		if(previewHandlers[node.type]) {
			output += previewHandlers[node.type].call(node);
		}
	};
	return output;
}


var previewHandlers = { 
	'section': function () {
		return `
			<div class='section'>
				${traversePreview(this.children)}
			</div>`;
	},
	'headline': function () {
		return `
			<h${this.level} class="${this.keyword?this.keyword:''} ${this.priority?this.priority:''}">
				${this.keyword?`<span class="keyword ${this.keyword.toLowerCase()}">${this.keyword}</span>`:''}
				${traversePreview(this.children.filter(node => node.type==='text'))}
			</h${this.level}>
			<div class="headline-properties level${this.level}"> 
				${traversePreview(this.children.filter(node => node.type!=="text"))}
			</div>`;
	} ,
	'text': function() {
		return `
			<span>${this.value}${traversePreview(this.children)}</span>`;
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
	'list': function() {
		return `
			<div class='list'>
			${this.ordered?'<ol>':'<ul>'}
				${traversePreview(this.children)}
			${this.ordered?'</ol>':'</ul>'}
			</div>`;
	},
	'list.item': function() {
		return `
			<li>
				${(this.checked != undefined)?`<input type="checkbox" ${this.checked?'checked':''} />`:''}
				${traversePreview(this.children)}
			</li>`;
	},
	'table': function() {
		return `<table>${traversePreview(this.children)}</table>`;
	},
	'table.row': function() {
		return `<tr>${traversePreview(this.children)}</tr>`;
	}, 
	'table.cell': function() {
		return `<td>${traversePreview(this.children)}</td>`;
	},
	'bold': function() {
		return `<b>${traversePreview(this.children)}</b>`;
	},
	'italic': function() {
		return `<i>${traversePreview(this.children)}</i>`;
	}
	//TODO include the rest of the nodes of the AST
};