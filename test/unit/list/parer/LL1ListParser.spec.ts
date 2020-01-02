import { LL1ListLexer } from '../../../../src/list/lexer/LL1ListLexer';
import { LL1ListParser } from '../../../../src/list/parser/LL1ListParser';

describe('LL1ListParser', (): void => {
    describe('parse', (): void => {
        it('a simple list', (): void => {
            const lexer: LL1ListLexer = new LL1ListLexer('[a,b]');
            const parser: LL1ListParser = new LL1ListParser(lexer);

            expect((): void => {
                parser.list();
            }).not.toThrow();
        });

        it('a nested list', (): void => {
            const lexer: LL1ListLexer = new LL1ListLexer('[a,[x,y,x],[foo,[quux]],b]');
            const parser: LL1ListParser = new LL1ListParser(lexer);

            expect((): void => {
                parser.list();
            }).not.toThrow();
        });

        it('throw an error when the input is not valid', (): void => {
            const lexer: LL1ListLexer = new LL1ListLexer('[a,[x,y,x],[foo,[quux],b]');
            const parser: LL1ListParser = new LL1ListParser(lexer);

            expect((): void => {
                parser.list();
            }).toThrow();
        });
    });
});
