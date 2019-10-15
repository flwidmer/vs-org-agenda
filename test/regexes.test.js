/* global suite, test */
import { getKeywordInHeadlineRegex, HEADLINE_REGEX } from '../src/regexes';

const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// const vscode = require('vscode');
// const myExtension = require('../extension');

// Defines a Mocha test suite to group tests of similar kind together
suite('Regex Tests', function() {

	// Defines a Mocha unit test
	test('Headline regex 1', function() {
        let regex = getKeywordInHeadlineRegex();
		assert.equal('TODO',regex.exec('** TODO something which i will have DONE')[1]);
	});

	test('Headline regex 2', function() {
		let regex = HEADLINE_REGEX;
		assert.equal('',regex.exec('** nothing which i will have DONE')[2]);
		assert.equal('**',regex.exec('** nothing which i will have DONE')[1]);
		assert.equal('nothing',regex.exec('** nothing ')[4]);
	});
});
