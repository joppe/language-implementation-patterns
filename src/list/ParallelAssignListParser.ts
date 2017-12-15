import {BacktrackParser} from 'app/lip/BacktrackParser';
import {EOF_TYPE, TokenTypes} from 'app/list/ExtendedListLexer';

/**
 * stat: list EOF | assign EOF;
 * assign: list '=' list;
 * list: '[' elements ']';
 * elements: element (',' element)*;
 * element: NAME '=' NAME | NAME | list
 */

/**
 * @class ParallelAssignListParser
 */
export class ParallelAssignListParser extends BacktrackParser {
    /**
     * Match: list EOF | assign EOF
     */
    public stat(): void {
        if (this.speculateStatList()) {
            this.list();
            this.match(EOF_TYPE);
        } else if (this.speculateStatAssign()) {
            this.assign();
            this.match(EOF_TYPE);
        } else {
            throw new Error(`Expecting stat found "${this.getLookaheadByOffset(1)}"`);
        }
    }

    /**
     * @returns {boolean}
     */
    public speculateStatList(): boolean {
        let success: boolean = true;

        this.mark();

        try {
            this.list();
            this.match(EOF_TYPE);
        } catch (e) {
            success = false;
        }

        this.release();

        return success;
    }

    /**
     * @returns {boolean}
     */
    public speculateStatAssign(): boolean {
        let success: boolean = true;

        this.mark();

        try {
            this.assign();
            this.match(EOF_TYPE);
        } catch (e) {
            success = false;
        }

        this.release();

        return success;
    }

    /**
     * Match: list '=' list
     */
    public assign(): void {
        this.list();
        this.match(TokenTypes.EQAULS);
        this.list();
    }

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
