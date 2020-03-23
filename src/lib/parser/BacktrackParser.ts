import { Lexer } from '../lexer/Lexer';
import { Parser } from './Parser';
import { Token } from '../token/Token';

export abstract class BacktrackParser implements Parser {
    protected lookahead: Token[] = [];
    protected pointer: number = 0;
    protected readonly input: Lexer;

    private readonly _markers: number[] = [];

    public constructor(input: Lexer) {
        this.input = input;
    }

    public match(type: number): void {
        if (this.getLookaheadType(1) === type) {
            this.consume();
        } else {
            throw new Error(`Expecting "${this.input.getTokenName(type)}", found "${this.getLookaheadToken(1)}"`);
        }
    }

    public consume(): void {
        this.pointer += 1;

        if ((this.pointer === this.lookahead.length) && !this.isSpeculating()) {
            this.pointer = 0;

            this.lookahead = [];
        }

        this.sync(1);
    }

    public getLookaheadToken(offset: number): Token {
        this.sync(offset);

        return this.lookahead[this.pointer + offset - 1];
    }

    public getLookaheadType(offset: number): number {
        return this.getLookaheadToken(offset).type;
    }

    protected isSpeculating(): boolean {
        return this._markers.length > 0;
    }

    protected mark(): number {
        this._markers.push(this.pointer);

        return this.pointer;
    }

    protected release(): void {
        const pointer: number = <number>this._markers.pop();

        this.seek(pointer);
    }

    protected seek(pointer: number): void {
        this.pointer = pointer;
    }

    /**
     * Make sure we have enough lookahead tokens
     */
    protected sync(offset: number): void {
        const desiredBufferSize: number = this.pointer + offset;
        const currentBufferSize: number = this.lookahead.length;

        if (desiredBufferSize > currentBufferSize) {
            this.fill(desiredBufferSize - currentBufferSize);
        }
    }

    /**
     * Add tokens to the lookahead array
     */
    protected fill(count: number): void {
        for (let i: number = 0; i < count; i += 1) {
            this.lookahead.push(this.input.nextToken());
        }
    }

    /**
     * Try if the given alternative function is successful
     */
    protected speculate(alternative: () => void): boolean {
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
