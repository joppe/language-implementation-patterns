import {EOF, EOF_TYPE, LL1Lexer, TokenTypeReference} from 'app/lip/LL1Lexer';
import {Token} from 'app/lip/Token';

/**
 * Grammar
 *
 * list: '[' elements ']'
 * elements: element (',' element)*
 * element: NAME | list
 * NAME: ('a'..'z'|'A'..'Z')
 */

/**
 * Available Token types
 *
 * @enum
 */
export enum TokenTypes {
    NAME = 2,
    COMMA,
    LBRACK,
    RBRACK
}

/**
 * The name of each token
 *
 * @type {TokenTypeReference}
 */
const TokenNames: TokenTypeReference = {
    [EOF_TYPE]: '<EOF>',
    [TokenTypes.NAME]: 'NAME',
    [TokenTypes.COMMA]: 'COMMA',
    [TokenTypes.LBRACK]: 'LBRACK',
    [TokenTypes.RBRACK]: 'RBRACK'
};

/**
 * @type {string}
 */
const COMMA: string = ',';

/**
 * @type {string}
 */
const LBRACK: string = '[';

/**
 * @type {string}
 */
const RBRACK: string = ']';

/**
 * @type {RegExp}
 */
const WHITESPACE_RE: RegExp = /\s/;

/**
 * @class ListLexer
 */
export class ListLexer extends LL1Lexer {
    /**
     * @returns {Token}
     * @throws {Error}
     */
    public nextToken(): Token {
        while (this.char !== EOF) {
            if (this.isWhitespace()) {
                this.whitespace();
            } else if (COMMA === this.char) {
                this.consume();

                return new Token(TokenTypes.COMMA, this.getTokenName(TokenTypes.COMMA), COMMA);
            } else if (LBRACK === this.char) {
                this.consume();

                return new Token(TokenTypes.LBRACK, this.getTokenName(TokenTypes.LBRACK), LBRACK);
            } else if (RBRACK === this.char) {
                this.consume();

                return new Token(TokenTypes.RBRACK, this.getTokenName(TokenTypes.RBRACK), RBRACK);
            } else {
                if (this.isLetter()) {
                    return this.name();
                } else {
                    throw new Error(`Invalid character "${this.char}"`);
                }
            }
        }

        return new Token(EOF_TYPE, this.getTokenName(EOF_TYPE), TokenNames[EOF_TYPE]);
    }

    /**
     * @param {number} type
     * @returns {string}
     * @throws {Error}
     */
    public getTokenName(type: number): string {
        const name: string = TokenNames[type];

        if (undefined === name) {
            throw new Error(`Invalid token type "${type}"`);
        }

        return name;
    }

    /**
     * Consume all whitespace. Whitespace has no meaning in the grammar.
     */
    private whitespace(): void {
        while (this.isWhitespace()) {
            this.consume();
        }
    }

    /**
     * Get all text belonging to a single NAME token.
     *
     * @returns {Token}
     */
    private name(): Token {
        let buffer: string = '';

        do {
            buffer += this.char;

            this.consume();
        } while (this.isLetter());

        return new Token(TokenTypes.NAME, this.getTokenName(TokenTypes.NAME), buffer);
    }

    /**
     * @returns {boolean}
     */
    private isLetter(): boolean {
        return (
            this.char >= 'a' && this.char <= 'x' ||
            this.char >= 'A' && this.char <= 'X'
        );
    }

    /**
     * @returns {boolean}
     */
    private isWhitespace(): boolean {
        return WHITESPACE_RE.test(this.char);
    }
}
