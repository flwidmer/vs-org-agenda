import * as vscode from 'vscode';
import * as utils from './utils';
import * as renderer from './orgRenderer';
import { parseOrgaAst, dfsOnAst } from './orgaAdapter';
import { HEADLINE_REGEX, SCHEDULED_REGEX, DEADLINE_REGEX, getCompleteHeadlineRegexWithKeywords } from './regexes';

/**
 * Returns position of headline above. if it can find one
 * @returns lineNumber
 */
export function getHeadlinePosition() {
    let editor = utils.getActiveTextEditor();
    let line = utils.getLine();
    let currentPosition = line.lineNumber;
    //Move up until headline is found
    while (currentPosition != 0 && !HEADLINE_REGEX.test(line.text)) {
        currentPosition--;
        line = editor.lineAt(currentPosition);
    }
    return line.lineNumber;
}

export function changeKeyword(lineNumber, newKeyword) {
    let editor = vscode.window.activeTextEditor
    let line = editor.document.lineAt(lineNumber);
    let headlineAst = parseOrgaAst(line.text);
    dfsOnAst(headlineAst, n => {
        if (n.type === 'headline') {
            n.keyword = newKeyword;
            return false;
        } else {
            return true;
        }
    });
    let rendered = renderer.renderOrg(headlineAst);
    // let keyword = regex.exec(line.text)[1];
    return editor.edit(edit => {
        edit.replace(line.range, rendered);
    });
}

/**
 * Walks up the subtree, aggregating the path of headlines.
 * @param {Number} lineNumber The linenumber where the path starts.
 * @returns List of path elements
 */
export function compileUpwardPath(lineNumber) {
    let editor = utils.getActiveTextEditor();
    var line = editor.lineAt(lineNumber);
    let currentPosition = line.lineNumber;
    let path = [];
    let currentLevel = 10000;
    //Move up until headline is found
    while (currentLevel != 1) {
        while (currentPosition != 0 && !HEADLINE_REGEX.test(line.text)) {
            currentPosition--;
            line = editor.lineAt(currentPosition);
        }
        if(currentPosition == 0) {
            currentLevel = 0;
        }
        //We reached a headline
        let groups = getCompleteHeadlineRegexWithKeywords().exec(line.text);
        let level = groups[1].length;
        if(level < currentLevel) {
            currentLevel = level;
            path.push(groups)
        }
        currentPosition--;
        line = editor.lineAt(currentPosition);
    }
    return path.map(function(l) {
        return {
            level: l[1],
            keyword: l[2],
            priority: l[4],
            text: l[5],
            full: l[0],
            groups: l
        };
    }).reverse();
}

/**
 * Get the range that contains the this entire subtree
 * @param {Number} lineNumber 
 * @returns Range
 */
export function getSubtreeRange (lineNumber) {
    let editor = utils.getActiveTextEditor();
    let line = editor.lineAt(lineNumber);
    let currentPosition = line.lineNumber;
    // move up until headline is found
    while (currentPosition != 0 && !HEADLINE_REGEX.test(line.text)) {
        currentPosition--;
        line = editor.lineAt(currentPosition);
    }
    if(currentPosition == 0) {
        return;
    }
    let rangeStart = line;
    // move down until a headline of same level or less is found
    let subtreeLevel = getHeadlineLevelOfTextLine(line);
    let currentLevel = 10000;
    //move cursor one line at least.
    currentPosition++;
    line = editor.lineAt(currentPosition);
    while (currentLevel > subtreeLevel) {
        while (currentPosition < editor.lineCount && !HEADLINE_REGEX.test(line.text)) {
            currentPosition++;
            line = editor.lineAt(currentPosition);
        }
        currentLevel = getHeadlineLevelOfTextLine(line);
        if(currentLevel > subtreeLevel) {
            currentPosition++;
            line = editor.lineAt(currentPosition);
        }
    }
    if(currentPosition != editor.lineCount) {
        //go back one line if we were not at the end of the document.
        currentPosition--;
    }
    line = editor.lineAt(currentPosition);
    return new vscode.Range(new vscode.Position(rangeStart.lineNumber,0), new vscode.Position(currentPosition, line.text.length));
}

function getHeadlineLevelOfTextLine(line) {
    return getHeadlineLevelOfStringLine(line.text);
}



function getHeadlineLevelOfStringLine(line) {
    let groups = HEADLINE_REGEX.exec(line);
    if(!groups || groups.length < 2) {
        return 0;
    }
    return groups[1].length;
}

/**
 * 
 * @param {Number} desiredLevel 
 * @param {String} content 
 */
export function adjustHeadlineLevel(desiredLevel, content) {
    let lines = utils.splitIntoLines(content);
    //get level of first one to calculate adjustment
    let firstHeadlineLevel = 1;
    for(let l = 0; l < lines.length; l++) {
        if(HEADLINE_REGEX.test(lines[l])) {
            firstHeadlineLevel = getHeadlineLevelOfStringLine(lines[l]);
            break;
        }
    }
    let shift = desiredLevel - firstHeadlineLevel;
    let mappedContent = lines.map(function(l) {
        let level = getHeadlineLevelOfStringLine(l);
        if(level === 0) {
            return l;
        }
        let newLevel = level + shift;
        l = l.replace(new RegExp('\\*{'+ level+'}'), getAsterisks(newLevel));
        return l;
    }).join('\n');
    return mappedContent;
}

function getAsterisks(number) {
    let r = '';
    for(let i = 0; i < number; i++) {
        r = r + '*';
    }
    return r;
}


/**
 * Compile all paths in a file
 * @param {String} filePath The file to scan for all paths
 */
export function compileAllPaths(filePath) {
    //TODO FWI implement, use for refile
}

/**
 * 
 * @param {String} name 
 * @param {String} content 
 */
export function createDrawer(name, content) {
    name = name.toUpperCase();
    return `
    :${name}:
    ${content}
    :END:`;
}

/**
 * 
 * @param {String} drawer representing the content of the drawer
 * @param {String} content the target document (has to start with a headline)
 */
export function insertDrawer(drawer, content) {
    let lines = utils.splitIntoLines(content);
    //get level of first one to calculate adjustment
    let targetLineNumber = 0;
    for(let l = 0; l < lines.length; l++) {
        if(HEADLINE_REGEX.test(lines[l]) || SCHEDULED_REGEX.test(lines[l]) || DEADLINE_REGEX.test(lines[l])) {
            targetLineNumber++;
        } else {
            break;
        }

    }
    let begin = lines.slice(0, targetLineNumber).join('\n');
    let end = lines.slice(targetLineNumber, lines.length).join('\n');
    return begin + '\n' + drawer + '\n' + end;
}