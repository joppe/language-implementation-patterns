import { EOF } from '../../lib/token/vocabulary';
import { EOF_TYPE } from '../../lib/token/TokenType';
import { LL1ListLexer } from './LL1ListLexer';
import { TokenNames } from '../token/TokenNames';
import { Token } from '../../lib/token/Token';
import { TokenTypes } from '../token/TokenTypes';
import { Vocabulary } from '../token/Vocabulary';

export class LL1AdvancedListLexer extends LL1ListLexer {
    public nextToken(): Token {
        while (this.char !== EOF) {
            if (this.isWhitespace()) {
                this.whitespace();
            } else if (this.char === Vocabulary.COMMA) {
                this.consume();

                return this.createToken(TokenTypes.COMMA, Vocabulary.COMMA);
            } else if (this.char === Vocabulary.EQUALS) {
                this.consume();

                return this.createToken(TokenTypes.EQAULS, Vocabulary.EQUALS);
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
}
