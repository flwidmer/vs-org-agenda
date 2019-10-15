import * as vscode from 'vscode';
import { adjustHeadlineLevel, createDrawer, insertDrawer } from './headlines';
import { timestampNow } from './dateutil';
import { splitIntoLines } from './utils';
import { HEADLINE_REGEX, getKeywordInHeadlineRegex } from './regexes';

/**
 * 
 * @param {String} content The content to be inserted
 * @param {Number} lineNumber Starting insertion at this line number
 * @param {String} targetFile filePath 
 */
export function moveSectionToFile(content, lineNumber, targetFile) {

}

/**
 * Move an entire subtree under a different subtree
 * @param {String} content The content to be refiled
 * @param {String} targetFile Filepath
 * @param {Object[]} targetPath Org headline under which the insertion should occur
 */
export function refile(content, targetFile, targetPath) {

}

/**
 * 
 * @param {String} content Content to move to Archive File
 * @param {String} targetFile Filepath
 * @param {Object[]} originalPath Org headline under which this was originally filed
 */
export function archive(content, targetFile, originalPath, originalFile) {
    content = adjustHeadlineLevel(1, content);
    let headline = splitIntoLines(content)[0];
    let keyword;
    let maybeKeyword = getKeywordInHeadlineRegex().exec(headline);
    if(maybeKeyword && maybeKeyword.length > 1) {
        keyword = maybeKeyword[1];
    }
    let path = originalPath.map(p => p.text).join('/');
    let drawer = createDrawer('PROPERTIES', createArchiveProperties(originalFile, path, keyword));
    content = insertDrawer(drawer, content);
    let setting = vscode.Uri.file(targetFile);
    vscode.workspace.openTextDocument(setting)
    .then((document) => {
        vscode.window.showTextDocument(document, 1, false).then(e => {
            e.edit(edit => {
                edit.insert(new vscode.Position(document.lineCount, 0), content);
            });
        });
    });
}

function createArchiveProperties(oldFile, oldPath, keyword) {
    return `
    ${createArchiveProperty('TIME', timestampNow())}
    ${createArchiveProperty('FILE', oldFile)}
    ${createArchiveProperty('OLPATH', oldPath)}
    ${createArchiveProperty('TODO', keyword)}
    `.trim();
}

/**
 * 
 * @param {String} name 
 * @param {String} value 
 */
function createArchiveProperty(name, value) {
    if(!value || value ==='') {
        return '';
    }
    name = name.toUpperCase();
    return `:ARCHIVE_${name}: ${value}`;
}