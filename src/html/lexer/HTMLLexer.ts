import { StringBuffer } from '../../lib/string/StringBuffer';
import { LexerContext } from './LexerContext';
import { EOF } from '../../lib/token/vocabulary';
import { EOF_TYPE } from '../../lib/token/TokenType';
import { LL1RecursiveDescentLexer } from '../../lib/lexer/LL1RecursiveDescentLexer';
import { TokenNames } from '../token/TokenNames';
import { Token } from '../../lib/token/Token';
import { TokenTypes } from '../token/TokenTypes';
import { Vocabulary, WHITESPACE_RE } from '../token/Vocabulary';

export class HTMLLexer extends LL1RecursiveDescentLexer {
    private context: LexerContext = LexerContext.EMPTY;

    public nextToken(): Token {
        while (this.char !== EOF) {
            switch (this.context) {
                case LexerContext.EMPTY:
                    return this.contextEmpty();
                case LexerContext.TAG:
                    return this.contextTag();
                case LexerContext.ATTRIBUTE:
                    return this.contextAttribute();
                case LexerContext.ATTRIBUTE_VALUE:
                    return this.contextAttributeValue();
                case LexerContext.CONTENT:
                    return this.contextContent();
                default:
                    this.consume();
            }
        }

        return this.createToken(EOF_TYPE, TokenNames[EOF_TYPE]);
    }

    public getTokenName(type: number): string {
        const name: string = TokenNames[type];

        if (name !== undefined) {
            return name;
        }

        throw new Error(`Invalid token type "${type}"`);
    }

    private contextEmpty(): Token {
        if (this.isWhitespace()) {
            this.whitespace();
        }

        if (this.char === Vocabulary.LT) {
            this.consume();

            this.context = LexerContext.TAG;

            return this.createToken(TokenTypes.LT, Vocabulary.LT);
        }

        throw new Error(`Invalid character "${this.char}" in context EMPTY`);
    }

    private contextTag(): Token {
        if (this.char === Vocabulary.FSLASH) {
            this.consume();

            return this.createToken(TokenTypes.FSLASH, Vocabulary.FSLASH);
        } else if (this.isLetter()) {
            this.context = LexerContext.ATTRIBUTE;

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
        }

        if (this.char === Vocabulary.EQUALS) {
            this.consume();

            return this.createToken(TokenTypes.EQUALS, Vocabulary.EQUALS);
        }

        if (this.char === Vocabulary.DBQUOTES) {
            this.consume();

            this.context = LexerContext.ATTRIBUTE_VALUE;

            return this.createToken(TokenTypes.DBQUOTES, Vocabulary.DBQUOTES);
        }

        if (this.char === Vocabulary.FSLASH) {
            this.consume();

            return this.createToken(TokenTypes.FSLASH, Vocabulary.FSLASH);
        }

        if (this.char === Vocabulary.GT) {
            this.consume();

            this.context = LexerContext.CONTENT;

            return this.createToken(TokenTypes.GT, Vocabulary.GT);
        }

        throw new Error(`Invalid character "${this.char}" in context ATTRIBUTE`);
    }

    private contextContent(): Token {
        if (this.char === Vocabulary.LT) {
            this.consume();

            this.context = LexerContext.TAG;

            return this.createToken(TokenTypes.LT, Vocabulary.LT);
        } else {
            return this.content();
        }
    }

    private contextAttributeValue(): Token {
        if (this.char === Vocabulary.DBQUOTES) {
            this.consume();

            this.context = LexerContext.ATTRIBUTE;

            return this.createToken(TokenTypes.DBQUOTES, Vocabulary.DBQUOTES);
        }

        return this.attributeValue();
    }

    private content(): Token {
        const buffer: StringBuffer = new StringBuffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.char !== Vocabulary.LT);

        return this.createToken(TokenTypes.CONTENT, buffer.toString());
    }

    private attributeValue(): Token {
        const buffer: StringBuffer = new StringBuffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.char !== Vocabulary.DBQUOTES);

        return this.createToken(TokenTypes.ATTRIBUTE_VALUE, buffer.toString());
    }

    private attributeName(): Token {
        const buffer: StringBuffer = new StringBuffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.isId());

        return this.createToken(TokenTypes.ATTRIBUTE_NAME, buffer.toString());
    }

    private tagName(): Token {
        const buffer: StringBuffer = new StringBuffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.isId());

        return this.createToken(TokenTypes.TAG_NAME, buffer.toString());
    }

    private whitespace(): void {
        while (this.isWhitespace()) {
            this.consume();
        }
    }

    private isId(): boolean {
        return this.isLetter() || this.isDigit() || this.char === Vocabulary.MINUS || this.char === Vocabulary.UNDERSCORE;
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
