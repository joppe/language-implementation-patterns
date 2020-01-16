import { LLkRecursiveDescentParser } from '../../lib/parser/LLkRecursiveDescentParser';
import { Types } from '../token/Types';

export class LL1HTMLParser extends LLkRecursiveDescentParser {
    public document(): void {
    }

    public element(): void {
        if (this.getLookaheadType(1) === Types.LT && this.getLookaheadType(2) === Types.EQUALS) {
        }
    }

    public tagPair(): void {}
    public tagOpen(): void {}

    public tagContent(): void {
        while (this.getLookaheadType(1) === Types.CONTENT || this.getLookaheadType(1) === Types.LT) {
            if (this.getLookaheadType(1) === Types.CONTENT) {
                this.match(Types.CONTENT);
            } else if (this.getLookaheadType(1) === Types.LT) {
                this.element();
            }
        }
    }

    public tagClose(): void {
        this.match(Types.LT);
        this.match(Types.FSLASH);
        this.match(Types.TAG_NAME);
        this.match(Types.GT);
    }

    public attrList(): void {
        while (this.getLookaheadType(1) === Types.ATTRIBUTE_NAME) {
            this.attr();
        }
    }

    public attr(): void {
        if (this.getLookaheadType(1) === Types.ATTRIBUTE_NAME && this.getLookaheadType(2) === Types.EQUALS) {
            this.match(Types.ATTRIBUTE_NAME);
            this.match(Types.EQUALS);
            this.match(Types.DBQUOTES);
            this.match(Types.ATTRIBUTE_VALUE);
            this.match(Types.DBQUOTES);
        } else if (this.getLookaheadType(1) === Types.ATTRIBUTE_NAME) {
            this.match(Types.ATTRIBUTE_NAME);
        } else {
            throw new Error(`Expecting attribute name token, found ${this.getLookaheadToken(1)}`);
        }
    }
}
