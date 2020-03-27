import { BacktrackParser } from '../../lib/parser/BacktrackParser';
import { EOF_TYPE } from '../../lib/token/TokenType';
import { TokenTypes } from '../token/TokenTypes';

/**
 * stat: list EOF | assign EOF;
 * assign: list '=' list;
 * list: '[' elements ']';
 * elements: element (',' element)*;
 * element: NAME '=' NAME | NAME | list
 */

export class BacktrackListParser extends BacktrackParser {
    public stat(): void {
        if (this.speculateStatList()) {
            this.statList();
        } else if (this.speculateStatAssign()) {
            this.statAssign();
        } else {
            throw new Error(`Expecting stat found "${this.getLookaheadToken(1)}"`);
        }
    }

    public speculateStatList(): boolean {
        return this.speculate((): void => {
            this.statList();
        });
    }

    public speculateStatAssign(): boolean {
        return this.speculate((): void => {
            this.statAssign();
        });
    }

    public statList(): void {
        this.list();
        this.match(EOF_TYPE);
    }

    public statAssign(): void {
        this.assign();
        this.match(EOF_TYPE);
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

        while (this.getLookaheadType(1) === TokenTypes.COMMA) {
            this.match(TokenTypes.COMMA);
            this.element();
        }
    }

    /**
     * Match: element: NAME '=' NAME | NAME | list
     */
    public element(): void {
        if (
            this.getLookaheadType(1) === TokenTypes.NAME &&
            this.getLookaheadType(2) === TokenTypes.EQAULS
        ) {
            this.match(TokenTypes.NAME);
            this.match(TokenTypes.EQAULS);
            this.match(TokenTypes.NAME);
        } else if (this.getLookaheadType(1) === TokenTypes.NAME) {
            this.match(TokenTypes.NAME);
        } else if (this.getLookaheadType(1) === TokenTypes.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list, found "${this.getLookaheadToken(1)}"`);
        }
    }
}
