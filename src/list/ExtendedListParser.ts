import {LLkParser} from 'app/lip/LLkParser';
import {TokenTypes} from 'app/list/ExtendedListLexer';

/**
 * @class ExtendedListParser
 */
export class ExtendedListParser extends LLkParser {
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

        while (this.getLookaheadTypeByOffset(1) === TokenTypes.COMMA) {
            this.match(TokenTypes.COMMA);
            this.element();
        }
    }

    /**
     * Match: element: NAME '=' NAME | NAME | list
     *
     * @throws {Error}
     */
    public element(): void {
        if (
            this.getLookaheadTypeByOffset(1) === TokenTypes.NAME &&
            this.getLookaheadTypeByOffset(2) === TokenTypes.EQAULS
        ) {
            this.match(TokenTypes.NAME);
            this.match(TokenTypes.EQAULS);
            this.match(TokenTypes.NAME);
        } else if (this.getLookaheadTypeByOffset(1) === TokenTypes.NAME) {
            this.match(TokenTypes.NAME);
        } else if (this.getLookaheadTypeByOffset(1) === TokenTypes.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list, found "${this.getLookaheadByOffset(1).toString()}"`);
        }
    }
}
