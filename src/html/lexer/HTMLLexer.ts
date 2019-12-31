import { EOF } from '../../lib/token/vocabulary';
import { EOF_TYPE } from '../../lib/token/Type';
import { Lexer } from '../../lib/lexer/Lexer';
import { Token } from '../../lib/token/Token';
import { DBQUOTES, EQUALS, FSLASH, GT, LT, WHITESPACE_RE } from '../token/vocabulary';
import { Types } from '../token/Types';
import { Names } from '../token/Names';

enum Context {
    EMPTY,
    TAG,
    ATTRIBUTE,
    ATTRIBUTE_VALUE,
    CONTENT,
}

export class HTMLLexer extends Lexer {
    private context: Context = Context.EMPTY;

    public nextToken(): Token {
        while (this.char !== EOF) {
            switch (this.context) {
                case Context.EMPTY:
                    return this.contextEmpty();
                case Context.TAG:
                    return this.contextTag();
                case Context.ATTRIBUTE:
                    return this.contextAttribute();
                case Context.ATTRIBUTE_VALUE:
                    return this.contextAttributeValue();
                case Context.CONTENT:
                    return this.contextContent();
                default:
                    this.consume();
            }
        }

        return this.createToken(EOF_TYPE, Names[EOF_TYPE]);
    }

    public getTokenName(type: number): string {
        const name: string = Names[type];

        if (name !== undefined) {
            return name;
        }

        throw new Error(`Invalid token type "${type}"`);
    }

    private contextEmpty(): Token {
        if (this.isWhitespace()) {
            this.whitespace();
        }

        if (this.char === LT) {
            this.consume();

            this.context = Context.TAG;

            return this.createToken(Types.LT, LT);
        }

        throw new Error(`Invalid character "${this.char}" in context EMPTY`);
    }

    private contextTag(): Token {
        if (this.char === FSLASH) {
            this.consume();

            return this.createToken(Types.FSLASH, FSLASH);
        } else if (this.isLetter()) {
            this.context = Context.ATTRIBUTE;

            return this.tagName();
        }

        throw new Error(`Invalid character "${this.char}" in context TAG`);
    }

    private contextAttribute(): Token {
        if (this.isWhitespace()) {
            this.whitespace();
        }

        if (this.isLetter()) {
            return this.attributeName();
        } else if (this.char === EQUALS) {
            this.consume();

            return this.createToken(Types.EQUALS, EQUALS);
        } else if (this.char === DBQUOTES) {
            this.consume();

            this.context = Context.ATTRIBUTE_VALUE;

            return this.createToken(Types.DBQUOTES, DBQUOTES);
        } else if (this.char === GT) {
            this.consume();

            this.context = Context.CONTENT;

            return this.createToken(Types.GT, GT);
        }

        throw new Error(`Invalid character "${this.char}" in context ATTRIBUTE`);
    }

    private contextContent(): Token {
        if (this.char === LT) {
            this.consume();

            this.context = Context.TAG;

            return this.createToken(Types.LT, LT);
        } else {
            return this.content();
        }
    }

    private contextAttributeValue(): Token {
        if (this.char === DBQUOTES) {
            this.consume();

            this.context = Context.ATTRIBUTE;

            return this.createToken(Types.DBQUOTES, DBQUOTES);
        }

        return this.attributeValue();
    }

    private content(): Token {
        let buffer: string = '';

        do {
            buffer += this.char;

            this.consume();
        } while (this.char !== LT);

        return this.createToken(Types.CONTENT, buffer);
    }

    private attributeValue(): Token {
        let buffer: string = '';

        do {
            buffer += this.char;

            this.consume();
        } while (this.char !== DBQUOTES);

        return this.createToken(Types.ATTRIBUTE_VALUE, buffer);
    }

    private attributeName(): Token {
        let buffer: string = '';

        do {
            buffer += this.char;

            this.consume();
        } while (this.isId());

        return this.createToken(Types.ATTRIBUTE_NAME, buffer);
    }

    private tagName(): Token {
        let buffer: string = '';

        do {
            buffer += this.char;

            this.consume();
        } while (this.isId());

        return this.createToken(Types.TAG_NAME, buffer);
    }

    private whitespace(): void {
        while (this.isWhitespace()) {
            this.consume();
        }
    }

    private isId(): boolean {
        return this.isLetter() || this.isDigit() || this.char === '-';
    }

    private isDigit(): boolean {
        return (
            this.char >= '0' && this.char <= '9'
        );
    }

    private isLetter(): boolean {
        return (
            this.char >= 'a' && this.char <= 'z' ||
            this.char >= 'A' && this.char <= 'Z'
        );
    }

    private isWhitespace(): boolean {
        return WHITESPACE_RE.test(this.char);
    }
}
