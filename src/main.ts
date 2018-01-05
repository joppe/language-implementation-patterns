import {ExtendedListLexer} from 'app/list/ExtendedListLexer';
import {MemoizedParallelAssignListParser} from 'app/list/MemoizedParallelAssignListParser';

const FUNC_NAME: string = 'parse';

/**
 * Add a function to the global scope so it can be called from the console.
 */
window[FUNC_NAME] = (input: string): void => {
    const lexer: ExtendedListLexer = new ExtendedListLexer(input);
    const parser: MemoizedParallelAssignListParser = new MemoizedParallelAssignListParser(lexer);

    parser.stat();
};
