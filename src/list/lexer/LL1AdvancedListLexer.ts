import { EOF } from '../../lib/token/vocabulary';
import { EOF_TYPE } from '../../lib/token/Type';
import { LL1ListLexer } from './LL1ListLexer';
import { Names } from '../token/Names';
import { Token } from '../../lib/token/Token';
import { Types } from '../token/Types';
import { Vocabulary } from '../token/Vocabulary';

export class LL1AdvancedListLexer extends LL1ListLexer {
    public nextToken(): Token {
        while (this.char !== EOF) {
            if (this.isWhitespace()) {
                this.whitespace();
            } else if (this.char === Vocabulary.COMMA) {
                this.consume();

                return this.createToken(Types.COMMA, Vocabulary.COMMA);
            } else if (this.char === Vocabulary.EQUALS) {
                this.consume();

                return this.createToken(Types.EQAULS, Vocabulary.EQUALS);
            } else if (this.char === Vocabulary.LBRACK) {
                this.consume();

                return this.createToken(Types.LBRACK, Vocabulary.LBRACK);
            } else if (this.char === Vocabulary.RBRACK) {
                this.consume();

                return this.createToken(Types.RBRACK, Vocabulary.RBRACK);
            } else if (this.isLetter()) {
                return this.name();
            } else {
                throw new Error(`Invalid character "${this.char}"`);
            }
        }

        return this.createToken(EOF_TYPE, Names[EOF_TYPE]);
    }
}
