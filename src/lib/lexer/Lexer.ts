import { EOF } from '../token/vocabulary';
import { Token } from '../token/Token';

/**
 * Lexers derive a stream of tokens from a character stream by recognizing lexical patterns.
 * AKA:
 * - scanners
 * - lexical anaylyzers
 * - tokenizers
 *
 * This is the implementation of a LL(1) Recursive-Descent Lexer
 */

export abstract class Lexer {
    protected char: string;

    protected readonly input: string;

    protected index: number = 0;

    protected readonly length: number;

    public constructor(input: string) {
        this.input = input;

        this.length = this.input.length;
        this.char = this.input.charAt(this.index);
    }

    public match(char: string): void {
        if (this.char === char) {
            this.consume();
        } else {
            throw new Error(`Lexer.match() error: expecting "${char}", found "${this.char}"`);
        }
    }

    public abstract nextToken(): Token;

    public abstract getTokenName(type: number): string;

    protected consume(): void {
        this.index += 1;

        if (this.index >= this.length) {
            this.char = EOF;
        } else {
            this.char = this.input.charAt(this.index);
        }
    }
}
