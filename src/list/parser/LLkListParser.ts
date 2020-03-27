import { LLkRecursiveDescentParser } from '../../lib/parser/LLkRecursiveDescentParser';
import { TokenTypes } from '../token/TokenTypes';

export class LLkListParser extends LLkRecursiveDescentParser {
    public list(): void {
        this.match(TokenTypes.LBRACK);
        this.elements();
        this.match(TokenTypes.RBRACK);
    }

    public elements(): void {
        this.element();

        while (this.getLookaheadType(1) === TokenTypes.COMMA) {
            this.match(TokenTypes.COMMA);
            this.element();
        }
    }

    public element(): void {
        if (this.getLookaheadType(1) === TokenTypes.NAME && this.getLookaheadType(2) === TokenTypes.EQAULS) {
            this.match(TokenTypes.NAME);
            this.match(TokenTypes.EQAULS);
            this.match(TokenTypes.NAME);
        } else if (this.getLookaheadType(1) === TokenTypes.NAME) {
            this.match(TokenTypes.NAME);
        } else if (this.getLookaheadType(1) === TokenTypes.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list token, found ${this.getLookaheadToken(1)}`);
        }
    }
}
