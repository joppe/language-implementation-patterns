import { Token } from '../token/Token';

/**
 * A grammar is a set of rules, each rule is a method on the Parser
 */

export abstract class Parser {
    // private _lookahead: Token;

    public match(): boolean {
        return false;
    }
}
