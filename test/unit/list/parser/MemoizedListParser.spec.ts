import { LL1AdvancedListLexer } from '@apestaartje/lip/list/lexer/LL1AdvancedListLexer';
import { MemoizedListParser } from '@apestaartje/lip/list/parser/MemoizedListParser';

describe('MemoizedListParser', (): void => {
    describe('parse', (): void => {
        it('sample', (): void => {
            const lexer: LL1AdvancedListLexer = new LL1AdvancedListLexer('[a,b]=[c,d]');
            const parser: MemoizedListParser = new MemoizedListParser(lexer);

            expect((): void => {
                parser.stat();
            }).not.toThrow();
        });
    });
});
