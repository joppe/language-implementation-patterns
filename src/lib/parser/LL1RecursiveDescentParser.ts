import { Token } from '../token/Token';
import { Lexer } from '../lexer/Lexer';

export abstract class LL1RecursiveDescentParser {
    protected input: Lexer;
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
