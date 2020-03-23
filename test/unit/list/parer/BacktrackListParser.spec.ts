import { LL1ListLexer } from '@apestaartje/lip/list/lexer/LL1ListLexer';
import { BacktrackListParser } from '@apestaartje/lip/list/parser/BacktrackListParser';

describe('BacktrackListParser', (): void => {
    describe('parse', (): void => {
        it('sample', (): void => {
            const lexer: LL1ListLexer = new LL1ListLexer('[a,b,[c,d]]');
            const parser: BacktrackListParser = new BacktrackListParser(lexer);

            expect((): void => {
                parser.stat();
            }).not.toThrow();
        });
    });
});
