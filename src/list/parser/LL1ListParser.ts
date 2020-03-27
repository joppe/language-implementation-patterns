import { LL1RecursiveDescentParser } from '../../lib/parser/LL1RecursiveDescentParser';
import { TokenTypes } from '../token/TokenTypes';

export class LL1ListParser extends LL1RecursiveDescentParser {
    public list(): void {
        this.match(TokenTypes.LBRACK);
        this.elements();
        this.match(TokenTypes.RBRACK);
    }

    public elements(): void {
        this.element();

        while (this.lookahead.type === TokenTypes.COMMA) {
            this.match(TokenTypes.COMMA);
            this.element();
        }
    }

    public element(): void {
        if (this.lookahead.type === TokenTypes.NAME) {
            this.match(TokenTypes.NAME);
        } else if (this.lookahead.type === TokenTypes.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list token, found ${this.lookahead.toString()}`);
        }
    }
}
