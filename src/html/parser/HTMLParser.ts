import { EOF_TYPE } from '../../lib/token/TokenType';
import { Lexer } from '../../lib/lexer/Lexer';
import { LLkRecursiveDescentParser } from '../../lib/parser/LLkRecursiveDescentParser';
import { ParseTree } from '../../lib/parser/tree/ParseTree';
import { rule } from '../../lib/parser/tree/rule';
import { RuleNode } from '../../lib/parser/tree/RuleNode';
import { SELF_CLOSING_TAGS } from '../token/Vocabulary';
import { TokenNode } from '../../lib/parser/tree/TokenNode';
import { TokenTypes } from '../token/TokenTypes';

export class HTMLParser extends LLkRecursiveDescentParser {
    private readonly _tagStack: string[] = [];
    private root: ParseTree | undefined;
    private currentNode: ParseTree | undefined;

    public constructor(lexer: Lexer) {
        super(lexer, 2);
    }

    public get parseTree(): ParseTree | undefined {
        return this.root;
    }

    private get tag(): string {
        return this._tagStack[this._tagStack.length - 1];
    }

    @rule
    public document(): void {
        while (this.getLookaheadType(1) === TokenTypes.LT) {
            this.element();
        }

        if (this.getLookaheadType(1) !== EOF_TYPE) {
            throw new Error(`Expecting end of file, found ${this.getLookaheadToken(1)}`);
        }
    }

    @rule
    public element(): void {
        if (this.getLookaheadType(2) !== TokenTypes.TAG_NAME) {
            throw new Error(`Expecting tag name, found ${this.getLookaheadToken(2)}`);
        }

        if (SELF_CLOSING_TAGS.indexOf(this.getLookaheadToken(2).text) > -1) {
            this.tagSelfClosing();
        } else {
            this.tagPair();
        }
    }

    @rule
    public tagSelfClosing(): void {
        this.match(TokenTypes.LT);
        this.match(TokenTypes.TAG_NAME);

        this.attrList();

        if (this.getLookaheadType(1) === TokenTypes.FSLASH) {
            this.match(TokenTypes.FSLASH);
        }

        this.match(TokenTypes.GT);
    }

    @rule
    public tagPair(): void {
        this.tagOpen();
        this.tagContent();
        this.tagClose();
    }

    @rule
    public tagOpen(): void {
        this.match(TokenTypes.LT);

        this.openTag(this.getLookaheadToken(1).text);
        this.match(TokenTypes.TAG_NAME);

        this.attrList();

        this.match(TokenTypes.GT);
    }

    @rule
    public tagContent(): void {
        while (
            this.getLookaheadType(1) === TokenTypes.CONTENT ||
            (this.getLookaheadType(1) === TokenTypes.LT && this.getLookaheadType(2) !== TokenTypes.FSLASH)
            ) {
            if (this.getLookaheadType(1) === TokenTypes.CONTENT) {
                this.match(TokenTypes.CONTENT);
            } else {
                this.element();
            }
        }
    }

    @rule
    public tagClose(): void {
        this.match(TokenTypes.LT);
        this.match(TokenTypes.FSLASH);

        this.closeTag(this.getLookaheadToken(1).text);
        this.match(TokenTypes.TAG_NAME);
        this.match(TokenTypes.GT);
    }

    @rule
    public attrList(): void {
        while (this.getLookaheadType(1) === TokenTypes.ATTRIBUTE_NAME) {
            this.attr();
        }
    }

    @rule
    public attr(): void {
        if (this.getLookaheadType(1) === TokenTypes.ATTRIBUTE_NAME && this.getLookaheadType(2) === TokenTypes.EQUALS) {
            this.match(TokenTypes.ATTRIBUTE_NAME);
            this.match(TokenTypes.EQUALS);
            this.match(TokenTypes.DBQUOTES);
            this.match(TokenTypes.ATTRIBUTE_VALUE);
            this.match(TokenTypes.DBQUOTES);
        } else if (this.getLookaheadType(1) === TokenTypes.ATTRIBUTE_NAME) {
            this.match(TokenTypes.ATTRIBUTE_NAME);
        } else {
            throw new Error(`Expecting attribute name token, found ${this.getLookaheadToken(1)}`);
        }
    }

    public match(type: number): void {
        (<ParseTree>this.currentNode).addChild(new TokenNode(this.getLookaheadToken(1)));
        super.match(type);
    }

    private rule(name: string, ruleFunction: () => void): void {
        const node: RuleNode = new RuleNode(name);

        if (this.root === undefined) {
            this.root = node;
        } else {
            (<ParseTree>this.currentNode).addChild(node);
        }

        const parseTree: ParseTree = <ParseTree>this.currentNode;
        this.currentNode = node;

        ruleFunction();

        this.currentNode = parseTree;
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
