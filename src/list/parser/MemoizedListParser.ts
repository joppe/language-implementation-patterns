import { EOF_TYPE } from '../../lib/token/Type';
import { MemoizingParser } from '../../lib/parser/MemoizingParser';
import { Types } from '../token/Types';

/**
 * stat: list EOF | assign EOF;
 * assign: list '=' list;
 * list: '[' elements ']';
 * elements: element (',' element)*;
 * element: NAME '=' NAME | NAME | list
 */

export class MemoizedListParser extends MemoizingParser {
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
            throw new Error(`Expecting stat found "${this.getLookaheadToken(1)}"`);
        }
    }

    public speculateStatList(): boolean {
        window.console.log('Attempt list');

        return this.speculate((): void => {
            this.list();
            this.match(EOF_TYPE);
        });
    }

    public speculateStatAssign(): boolean {
        window.console.log('Attempt assign');

        return this.speculate((): void => {
            this.assign();
            this.match(EOF_TYPE);
        });
    }

    /**
     * Match: list '=' list
     */
    public assign(): void {
        this.list();
        this.match(Types.EQAULS);
        this.list();
    }

    /**
     * Match: list: '[' elements ']'
     */
    public list(): void {
        this.memoizeRule('list', (): void => {
            this.match(Types.LBRACK);
            this.elements();
            this.match(Types.RBRACK);
        });
    }

    /**
     * Match: elements: element (',' element)*
     */
    public elements(): void {
        this.element();

        while (this.getLookaheadType(1) === Types.COMMA) {
            this.match(Types.COMMA);
            this.element();
        }
    }

    /**
     * Match: element: NAME '=' NAME | NAME | list
     */
    public element(): void {
        if (
            this.getLookaheadType(1) === Types.NAME &&
            this.getLookaheadType(2) === Types.EQAULS
        ) {
            this.match(Types.NAME);
            this.match(Types.EQAULS);
            this.match(Types.NAME);
        } else if (this.getLookaheadType(1) === Types.NAME) {
            this.match(Types.NAME);
        } else if (this.getLookaheadType(1) === Types.LBRACK) {
            this.list();
        } else {
            throw new Error(`Expecting name or list, found "${this.getLookaheadToken(1)}"`);
        }
    }
}
