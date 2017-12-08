import {LL1Parser} from 'app/lip/LL1Parser';
import {TokenTypes} from 'app/list/ListLexer';

/**
 * @class ListParser
 */
export class ListParser extends LL1Parser {
    /**
     * Match: list: '[' elements ']'
     */
    public list(): void {
        this.match(TokenTypes.LBRACK);
        this.elements();
        this.match(TokenTypes.RBRACK);
    }

    /**
     * Match: elements: element (',' element)*
     */
    public elements(): void {
        this.element();

        while (this.lookahead.type === TokenTypes.COMMA) {
            this.match(TokenTypes.COMMA);
            this.element();
        }
    }

    /**
     * Match: element: NAME | list
     *
     * @throws {Error}
     */
    public element(): void {
        if (this.lookahead.type === TokenTypes.NAME) {
            this.match(TokenTypes.NAME);
        } else if (this.lookahead.type === TokenTypes.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list, found "${this.lookahead.toString()}"`);
        }
    }
}
