import { ListLexer } from '../../../../src/list/lexer/ListLexer';
import { ListParser } from '../../../../src/list/parser/ListParser';

describe('ListParser', (): void => {
    describe('parse', (): void => {
        it('a simple list', (): void => {
            const lexer: ListLexer = new ListLexer('[a,b]');
            const parser: ListParser = new ListParser(lexer);

            expect((): void => {
                parser.list();
            }).not.toThrow();
        });

        it('a nested list', (): void => {
            const lexer: ListLexer = new ListLexer('[a,[x,y,x],[foo,[quux]],b]');
            const parser: ListParser = new ListParser(lexer);

            expect((): void => {
                parser.list();
            }).not.toThrow();
        });

        it('throw an error when the input is not valid', (): void => {
            const lexer: ListLexer = new ListLexer('[a,[x,y,x],[foo,[quux],b]');
            const parser: ListParser = new ListParser(lexer);

            expect((): void => {
                parser.list();
            }).toThrow();
        });
    });
});
