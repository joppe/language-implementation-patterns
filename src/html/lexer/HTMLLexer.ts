import { Buffer } from '../../lib/string/Buffer';
import { Context } from './Context';
import { EOF } from '../../lib/token/vocabulary';
import { EOF_TYPE } from '../../lib/token/Type';
import { LL1RecursiveDescentLexer } from '../../lib/lexer/LL1RecursiveDescentLexer';
import { Names } from '../token/Names';
import { Token } from '../../lib/token/Token';
import { Types } from '../token/Types';
import { Vocabulary, WHITESPACE_RE } from '../token/Vocabulary';

export class HTMLLexer extends LL1RecursiveDescentLexer {
    private readonly _context: Context[] = [Context.CONTENT];

    private get context(): Context {
        return this._context[this._context.length - 1];
    }

    public nextToken(): Token {
        while (this.char !== EOF) {
            switch (this.context) {
                case Context.CONTENT:
                    return this.contextContent();
                case Context.TAG:
                    return this.contextTag();
                case Context.ATTRIBUTE:
                    return this.contextAttribute();
                case Context.ATTRIBUTE_VALUE:
                    return this.contextAttributeValue();
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

    private setContext(context: Context): void {
        this._context.push(context);
    }

    private releaseContext(): void {
        this._context.pop();
    }

    private contextTag(): Token {
        // start of losing tag
        if (this.char === Vocabulary.FSLASH) {
            this.consume();

            return this.createToken(Types.FSLASH, Vocabulary.FSLASH);
        }

        if (this.isLetter()) {
            this.setContext(Context.ATTRIBUTE);

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

            return this.createToken(Types.EQUALS, Vocabulary.EQUALS);
        }

        if (this.char === Vocabulary.DBQUOTES) {
            this.consume();

            this.setContext(Context.ATTRIBUTE_VALUE);

            return this.createToken(Types.DBQUOTES, Vocabulary.DBQUOTES);
        }

        if (this.char === Vocabulary.FSLASH) {
            this.consume();

            return this.createToken(Types.FSLASH, Vocabulary.FSLASH);
        }

        if (this.char === Vocabulary.GT) {
            this.consume();

            this.releaseContext();
            this.releaseContext();

            return this.createToken(Types.GT, Vocabulary.GT);
        }

        throw new Error(`Invalid character "${this.char}" in context ATTRIBUTE`);
    }

    private contextContent(): Token {
        if (this.char === Vocabulary.LT) {
            this.consume();

            this.setContext(Context.TAG);

            return this.createToken(Types.LT, Vocabulary.LT);
        } else {
            return this.content();
        }
    }

    private contextAttributeValue(): Token {
        if (this.char === Vocabulary.DBQUOTES) {
            this.consume();

            this.releaseContext();

            return this.createToken(Types.DBQUOTES, Vocabulary.DBQUOTES);
        }

        return this.attributeValue();
    }

    private content(): Token {
        const buffer: Buffer = new Buffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.char !== Vocabulary.LT);

        return this.createToken(Types.CONTENT, buffer.toString());
    }

    private attributeValue(): Token {
        const buffer: Buffer = new Buffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.char !== Vocabulary.DBQUOTES);

        return this.createToken(Types.ATTRIBUTE_VALUE, buffer.toString());
    }

    private attributeName(): Token {
        const buffer: Buffer = new Buffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.isId());

        return this.createToken(Types.ATTRIBUTE_NAME, buffer.toString());
    }

    private tagName(): Token {
        const buffer: Buffer = new Buffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.isId());

        return this.createToken(Types.TAG_NAME, buffer.toString());
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
