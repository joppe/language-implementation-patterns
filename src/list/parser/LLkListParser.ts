import { LLkRecursiveDescentParser } from '../../lib/parser/LLkRecursiveDescentParser';
import { Types } from '../token/Types';

export class LLkListParser extends LLkRecursiveDescentParser {
    public list(): void {
        this.match(Types.LBRACK);
        this.elements();
        this.match(Types.RBRACK);
    }

    public elements(): void {
        this.element();

        while (this.getLookaheadType(1) === Types.COMMA) {
            this.match(Types.COMMA);
            this.element();
        }
    }

    public element(): void {
        if (this.getLookaheadType(1) === Types.NAME && this.getLookaheadType(2) === Types.EQAULS) {
            this.match(Types.NAME);
            this.match(Types.EQAULS);
            this.match(Types.NAME);
        } else if (this.getLookaheadType(1) === Types.NAME) {
            this.match(Types.NAME);
        } else if (this.getLookaheadType(1) === Types.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list token, found ${this.getLookaheadToken(1)}`);
        }
    }
}
