import { LL1RecursiveDescentParser } from '../../lib/parser/LL1RecursiveDescentParser';
import { Types } from '../token/Types';

export class ListParser extends LL1RecursiveDescentParser {
    public list(): void {
        this.match(Types.LBRACK);
        this.elements();
        this.match(Types.RBRACK);
    }

    public elements(): void {
        this.element();

        while (this.lookahead.type === Types.COMMA) {
            this.match(Types.COMMA);
            this.element();
        }
    }

    public element(): void {
        if (this.lookahead.type === Types.NAME) {
            this.match(Types.NAME);
        } else if (this.lookahead.type === Types.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list token, found ${this.lookahead.toString()}`);
        }
    }
}
