import {LL1Lexer} from 'app/lip/LL1Lexer';
import {Token} from 'app/lip/Token';

/**
 * @class LLkParser
 */
export abstract class LLkParser {
    /**
     * @type {LL1Lexer}
     */
    protected input: LL1Lexer;

    /**
     * @type {Token[]}
     */
    protected lookahead: Token[];

    /**
     * @type {number}
     */
    protected bufferSize: number;

    /**
     * The index of the circular lookahead buffer.
     *
     * @type {number}
     */
    protected index: number = 0;

    /**
     * @param {LL1Lexer} input
     * @param {number} bufferSize
     */
    constructor(input: LL1Lexer, bufferSize: number) {
        this.input = input;
        this.bufferSize = bufferSize;

        for (let i: number = 0; i <= this.bufferSize; i += 1) {
            this.consume();
        }
    }

    /**
     * @param {number} offset
     * @returns {Token}
     */
    public getLookaheadByOffset(offset: number): Token {
        return this.lookahead[(this.index + offset - 1) % this.bufferSize];
    }

    /**
     * @param {number} offset
     * @returns {number}
     */
    public getLookaheadTypeByOffset(offset: number): number {
        return this.getLookaheadByOffset(offset).type;
    }

    /**
     * @param {number} type
     */
    public match(type: number): void {
        if (this.getLookaheadTypeByOffset(1) === type) {
            this.consume();
        } else {
            throw new Error(`Expecting "${this.input.getTokenName(type)}", found "${this.getLookaheadByOffset(1).toString()}"`);
        }
    }

    /**
     * Consume a token. And recalculate the new index.
     */
    public consume(): void {
        this.lookahead[this.index] = this.input.nextToken();
        this.index = (this.index + 1) % this.bufferSize;
    }
}
