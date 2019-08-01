import * as orga from 'orga';

export function parseOrgaAst(input) {
    let content = input.replace(/\r/g, '');
    return orga.parse(content);
}

/**
 * DFS on AST. Enter a treeNode to start with and a visitor.
 * @param astNode orga parsed AST. A single node.
 * @param visitor a visitor function. Should return true if tree traversal is to continue
 */
export function dfsOnAst(astNode, visitor) {
    traverseDfs(astNode, visitor);
}

function traverseDfs(astNode, visitor) {
    if(visitor(astNode)) {
        for(let i = 0; i < astNode.children.length; i++) {
            if(!traverseDfs(astNode.children[i], visitor)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}