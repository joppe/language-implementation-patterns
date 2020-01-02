import { Lexer } from '../lexer/Lexer';
import { Parser } from './Parser';
import { Token } from '../token/Token';

export abstract class LL1RecursiveDescentParser implements Parser {
    protected readonly input: Lexer;
    protected lookahead: Token;

    public constructor(input: Lexer) {
        this.input = input;
        this.lookahead = this.input.nextToken();
    }

    public match(type: number): void {
        if (this.lookahead.type === type) {
            this.consume();

            return;
        }

        throw new Error(`Expecting ${this.input.getTokenName(type)}; found ${this.lookahead.toString()}`);
    }

    public consume(): void {
        this.lookahead = this.input.nextToken();
    }
}
