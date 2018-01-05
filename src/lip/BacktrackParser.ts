import {LL1Lexer} from 'app/lip/LL1Lexer';
import {Token} from 'app/lip/Token';

/**
 * @class BacktrackParser
 */
export abstract class BacktrackParser {
    /**
     * @type {LL1Lexer}
     */
    protected input: LL1Lexer;

    /**
     * @type {number[]}
     */
    protected markers: number[] = [];

    /**
     * @type {Token[]}
     */
    protected lookahead: Token[] = [];

    /**
     * The index of the current lookahead.
     *
     * @type {number}
     */
    protected index: number = 0;

    /**
     * @param {LL1Lexer} input
     */
    constructor(input: LL1Lexer) {
        this.input = input;
    }

    /**
     * @param {number} offset
     * @returns {Token}
     */
    public getLookaheadByOffset(offset: number): Token {
        this.sync(offset);

        return this.lookahead[this.index + offset - 1];
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
     * Make sure there are enough lookahead tokens.
     *
     * @param {number} offset
     */
    public sync(offset: number): void {
        const desiredBufferSize: number = this.index + offset;
        const currentBufferSize: number = this.lookahead.length;

        if (desiredBufferSize > currentBufferSize) {
            this.fill(desiredBufferSize - currentBufferSize);
        }
    }

    /**
     * Fill the array of lookahead tokens.
     *
     * @param {number} count
     */
    public fill(count: number): void {
        for (let i: number = 0; i < count; i += 1) {
            this.lookahead.push(this.input.nextToken());
        }
    }

    /**
     * Consume a token.
     */
    public consume(): void {
        this.index += 1;

        if ((this.index === this.lookahead.length) && !this.isSpeculating()) {
            this.index = 0;

            this.lookahead = [];
        }

        this.sync(1);
    }

    /**
     * Add a marker.
     *
     * @returns {number}
     */
    public mark(): number {
        this.markers.push(this.index);

        return this.index;
    }

    /**
     * Release a marker.
     */
    public release(): void {
        const index: number = this.markers.pop();

        this.seek(index);
    }

    /**
     * Set the lookahead index.
     *
     * @param {number} index
     */
    public seek(index: number): void {
        this.index = index;
    }

    /**
     * @returns {boolean}
     */
    public isSpeculating(): boolean {
        return this.markers.length > 0;
    }

    /**
     * Try to match a rule/alternative.
     * Rewind the lookahead after trying.
     *
     * @param {Function} alternative
     * @returns {boolean}
     */
    protected speculate(alternative: Function): boolean {
        let isSuccessFul: boolean = true;

        this.mark();

        try {
            alternative();
        } catch (e) {
            isSuccessFul = false;
        }

        this.release();

        return isSuccessFul;
    }
}
