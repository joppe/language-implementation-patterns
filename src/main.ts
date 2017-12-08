import {ListLexer} from 'app/list/ListLexer';
import {ListParser} from 'app/list/ListParser';

const FUNC_NAME: string = 'parse';

/**
 * Add a function to the global scope so it can be called from the console.
 */
window[FUNC_NAME] = (input: string): void => {
    const lexer: ListLexer = new ListLexer(input);
    const parser: ListParser = new ListParser(lexer);

    parser.list();
};
