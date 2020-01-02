import { Token } from '../token/Token';
import { Lexer } from '../lexer/Lexer';

/**
 * A grammar is a set of rules, each rule is a method on the Parser
 */

export abstract class Parser {
    protected input: Lexer;
    protected lookahead: Token;

    public match(type: number): boolean {
        return false;
    }
}
