import { Lexer } from '../lexer/Lexer';
import { Token } from '../token/Token';
import { Parser } from './Parser';

export abstract class LLkRecursiveDescentParser implements Parser {
    protected lookahead: Token[] = [];
    protected pointer: number = 0;
    protected readonly bufferSize: number;
    protected readonly input: Lexer;

    public constructor(input: Lexer, bufferSize: number) {
        this.input = input;
        this.bufferSize = bufferSize;

        for (let i: number = 0; i < this.bufferSize; i += 1) {
            this.consume();
        }
    }

    public getLookaheadToken(offset: number): Token {
        return this.lookahead[(this.pointer + offset - 1) % this.bufferSize];
    }

    public getLookaheadType(offset: number): number {
        return this.getLookaheadToken(offset).type;
    }

    public match(type: number): void {
        if (this.getLookaheadType(1) === type) {
            this.consume();
        } else {
            throw new Error(`Expecting "${this.input.getTokenName(type)}", found "${this.getLookaheadToken(1)}"`);
        }
    }

    public consume(): void {
        this.lookahead[this.pointer] = this.input.nextToken();
        this.pointer = (this.pointer + 1) % this.bufferSize;
    }
}
