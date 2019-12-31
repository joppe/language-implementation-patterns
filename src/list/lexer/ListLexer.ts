import { EOF } from '../../lib/token/vocabulary';
import { EOF_TYPE } from '../../lib/token/Type';
import { Lexer } from '../../lib/lexer/Lexer';
import { Token } from '../../lib/token/Token';
import { COMMA, LBRACK, RBRACK, WHITESPACE_RE } from '../token/vocabulary';
import { Types } from '../token/Types';
import { Names } from '../token/Names';

export class ListLexer extends Lexer {
    public nextToken(): Token {
        while (this.char !== EOF) {
            if (this.isWhitespace()) {
                this.whitespace();
            } else if (COMMA === this.char) {
                this.consume();

                return this.createToken(Types.COMMA, COMMA);
            } else if (LBRACK === this.char) {
                this.consume();

                return this.createToken(Types.LBRACK, LBRACK);
            } else if (RBRACK === this.char) {
                this.consume();

                return this.createToken(Types.RBRACK, RBRACK);
            } else if (this.isLetter()) {
                return this.name();
            } else {
                throw new Error(`Invalid character "${this.char}"`);
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

    /**
     * Get all text belonging to a single NAME token.
     */
    private name(): Token {
        let buffer: string = '';

        do {
            buffer += this.char;

            this.consume();
        } while (this.isLetter());

        return this.createToken(Types.NAME, buffer);
    }

    /**
     * Consume all whitespace. Whitespace has no meaning in the grammar.
     */
    private whitespace(): void {
        while (this.isWhitespace()) {
            this.consume();
        }
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
