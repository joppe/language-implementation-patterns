import { StringBuffer } from '../../lib/string/StringBuffer';
import { EOF } from '../../lib/token/vocabulary';
import { EOF_TYPE } from '../../lib/token/TokenType';
import { LL1RecursiveDescentLexer } from '../../lib/lexer/LL1RecursiveDescentLexer';
import { TokenNames } from '../token/TokenNames';
import { Token } from '../../lib/token/Token';
import { TokenTypes } from '../token/TokenTypes';
import { Vocabulary, WHITESPACE_RE } from '../token/Vocabulary';

export class LL1ListLexer extends LL1RecursiveDescentLexer {
    public nextToken(): Token {
        while (this.char !== EOF) {
            if (this.isWhitespace()) {
                this.whitespace();
            } else if (this.char === Vocabulary.COMMA) {
                this.consume();

                return this.createToken(TokenTypes.COMMA, Vocabulary.COMMA);
            } else if (this.char === Vocabulary.LBRACK) {
                this.consume();

                return this.createToken(TokenTypes.LBRACK, Vocabulary.LBRACK);
            } else if (this.char === Vocabulary.RBRACK) {
                this.consume();

                return this.createToken(TokenTypes.RBRACK, Vocabulary.RBRACK);
            } else if (this.isLetter()) {
                return this.name();
            } else {
                throw new Error(`Invalid character "${this.char}"`);
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

    /**
     * Get all text belonging to a single NAME token.
     */
    protected name(): Token {
        const buffer: StringBuffer = new StringBuffer();

        do {
            buffer.append(this.char);

            this.consume();
        } while (this.isLetter());

        return this.createToken(TokenTypes.NAME, buffer.toString());
    }

    /**
     * Consume all whitespace. Whitespace has no meaning in the grammar.
     */
    protected whitespace(): void {
        while (this.isWhitespace()) {
            this.consume();
        }
    }

    protected isLetter(): boolean {
        return (
            this.char >= 'a' && this.char <= 'z' ||
            this.char >= 'A' && this.char <= 'Z'
        );
    }

    protected isWhitespace(): boolean {
        return WHITESPACE_RE.test(this.char);
    }
}
