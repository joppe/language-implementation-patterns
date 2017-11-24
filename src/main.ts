import {EOF_TYPE} from 'app/lip/Lexer';
import {Token} from 'app/lip/Token';
import {ListLexer} from 'app/url/ListLexer';

/**
 * Just test the lexer
 */

const lexer: ListLexer = new ListLexer('[a, b]');
let token: Token = lexer.nextToken();

while (token.type !== EOF_TYPE) {
    window.console.log(token.toString());
    token = lexer.nextToken();
}

window.console.log(token.toString());
