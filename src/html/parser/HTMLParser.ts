import { EOF_TYPE } from '../../lib/token/Type';
import { Lexer } from '../../lib/lexer/Lexer';
import { LLkRecursiveDescentParser } from '../../lib/parser/LLkRecursiveDescentParser';
import { SELF_CLOSING_TAGS } from '../token/Vocabulary';
import { Types } from '../token/Types';

export class HTMLParser extends LLkRecursiveDescentParser {
    private readonly _tagStack: string[] = [];

    public constructor(lexer: Lexer) {
        super(lexer, 2);
    }

    private get tag(): string {
        return this._tagStack[this._tagStack.length - 1];
    }

    public document(): void {
        while (this.getLookaheadType(1) === Types.LT) {
            this.element();
        }

        if (this.getLookaheadType(1) !== EOF_TYPE) {
            throw new Error(`Expecting end of file, found ${this.getLookaheadToken(1)}`);
        }
    }

    public element(): void {
        if (this.getLookaheadType(2) !== Types.TAG_NAME) {
            throw new Error(`Expecting tag name, found ${this.getLookaheadToken(2)}`);
        }

        if (SELF_CLOSING_TAGS.indexOf(this.getLookaheadToken(2).text) > -1) {
            this.tagSelfClosing();
        } else {
            this.tagPair();
        }
    }

    public tagSelfClosing(): void {
        this.match(Types.LT);
        this.match(Types.TAG_NAME);

        this.attrList();

        if (this.getLookaheadType(1) === Types.FSLASH) {
            this.match(Types.FSLASH);
        }

        this.match(Types.GT);
    }

    public tagPair(): void {
        this.tagOpen();
        this.tagContent();
        this.tagClose();
    }

    public tagOpen(): void {
        this.match(Types.LT);

        this.openTag(this.getLookaheadToken(1).text);
        this.match(Types.TAG_NAME);

        this.attrList();

        this.match(Types.GT);
    }

    public tagContent(): void {
        while (
            this.getLookaheadType(1) === Types.CONTENT ||
            (this.getLookaheadType(1) === Types.LT && this.getLookaheadType(2) !== Types.FSLASH)
        ) {
            if (this.getLookaheadType(1) === Types.CONTENT) {
                this.match(Types.CONTENT);
            } else {
                this.element();
            }
        }
    }

    public tagClose(): void {
        this.match(Types.LT);
        this.match(Types.FSLASH);

        this.closeTag(this.getLookaheadToken(1).text);
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

    private openTag(tag: string): void {
        this._tagStack.push(tag);
    }

    private closeTag(tag: string): void {
        if (this.tag !== tag) {
            throw new Error(`Expecting close tag for "${this.tag}" instead "${tag}" was given.`);
        }

        this._tagStack.pop();
    }
}
