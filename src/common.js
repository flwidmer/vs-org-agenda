export {createHeader};

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

