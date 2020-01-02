import { LL1AdvancedListLexer } from '../../../../src/list/lexer/LL1AdvancedListLexer';
import { LLkListParser } from '../../../../src/list/parser/LLkListParser';

describe('LLkListParser', (): void => {
    describe('parse', (): void => {
        it('a simple list', (): void => {
            const lexer: LL1AdvancedListLexer = new LL1AdvancedListLexer('[a,b=c,[d,e]]');
            const parser: LLkListParser = new LLkListParser(lexer, 2);

            expect((): void => {
                parser.list();
            }).not.toThrow();
        });
    });
});
