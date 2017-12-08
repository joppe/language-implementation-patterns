import {LL1Lexer} from 'app/lip/LL1Lexer';
import {Token} from 'app/lip/Token';
import {TokenTypes} from 'app/list/ListLexer';

/**
 * @class LL1Parser
 */
export abstract class LL1Parser {
    /**
     * @type {LL1Lexer}
     */
    protected input: LL1Lexer;

    /**
     * @type {Token}
     */
    protected lookahead: Token;

    /**
     * @param {LL1Lexer} input
     */
    constructor(input: LL1Lexer) {
        this.input = input;
        this.lookahead = this.input.nextToken();
    }

    /**
     * @param {TokenTypes} tokenType
     * @throws {Error}
     */
    public match(tokenType: TokenTypes): void {
        if (this.lookahead.type === tokenType) {
            this.consume();
        } else {
            throw new Error(`Expecting "${this.input.getTokenName(tokenType).toString()}", found "${this.lookahead.toString()}"`);
        }
    }

    /**
     * Consume the token and get the next token as lookahead.
     */
    public consume(): void {
        this.lookahead = this.input.nextToken();
    }
}
