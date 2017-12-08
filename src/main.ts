import {ExtendedListLexer} from 'app/list/ExtendedListLexer';
import {ExtendedListParser} from 'app/list/ExtendedListParser';

const FUNC_NAME: string = 'parse';

/**
 * Add a function to the global scope so it can be called from the console.
 */
window[FUNC_NAME] = (input: string): void => {
    const lexer: ExtendedListLexer = new ExtendedListLexer(input);
    const parser: ExtendedListParser = new ExtendedListParser(lexer, 2);

    parser.list();
};
