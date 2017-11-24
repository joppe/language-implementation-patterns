import {Token} from 'app/lip/Token';

/**
 * @typedef TokenTypeReference
 */
export type TokenTypeReference = {
    [type: number]: string;
};

/**
 * Used as char indicating the end of the file.
 *
 * @type {string}
 */
export const EOF: string = '-1';

/**
 * Indicates the Token type for end of file.
 *
 * @type {number}
 */
export const EOF_TYPE: number = 1;

/**
 * @class Lexer
 */
export abstract class Lexer {
    /**
     * @type {string}
     * @protected
     */
    protected char: string;

    /**
     * @type {number}
     * @private
     */
    private _index: number = 0;

    /**
     * @type {string}
     * @private
     */
    private _input: string;

    /**
     * @type {number}
     * @private
     */
    private _length: number;

    /**
     * @param {string} input
     */
    public constructor(input: string) {
        this._input = input;
        this._length = this._input.length;
        this.char = this._input.charAt(this._index);
    }

    /**
     * @returns {Token}
     * @abstract
     * @public
     */
    public abstract nextToken(): Token;

    /**
     * @param {number} type
     * @returns {string}
     * @abstract
     * @public
     */
    public abstract getTokenName(type: number): string;

    /**
     * @param {string} char
     */
    public match(char: string): void {
        if (this.char === char) {
            this.consume();
        } else {
            throw new Error(`Match error: expecting "${char}", found "${this.char}"`);
        }
    }

    /**
     * Consume a character.
     */
    public consume(): void {
        this._index += 1;

        if (this._index >= this._length) {
            this.char = EOF;
        } else {
            this.char = this._input.charAt(this._index);
        }
    }
}
