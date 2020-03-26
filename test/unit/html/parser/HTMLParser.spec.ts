import { HTMLParser } from '@apestaartje/lip/html/parser/HTMLParser';
import { HTMLLexer } from '@apestaartje/lip/html/lexer/HTMLLexer';
import { EOF_TYPE } from '@apestaartje/lip/lib/token/Type';

describe('HTMLParser', (): void => {
    describe('parse', (): void => {
        it('tag pair', (): void => {
            const lexer: HTMLLexer = new HTMLLexer('<h1>foo</h1>');
            const parser: HTMLParser = new HTMLParser(lexer);

            expect((): void => {
                parser.tagPair();
            }).not.toThrow();
            expect(parser.getLookaheadType(1)).toBe(EOF_TYPE);
        });

        it('self closing tag', (): void => {
            const lexer: HTMLLexer = new HTMLLexer('<input required />');
            const parser: HTMLParser = new HTMLParser(lexer);

            expect((): void => {
                parser.tagSelfClosing();
            }).not.toThrow();
            expect(parser.getLookaheadType(1)).toBe(EOF_TYPE);
        });

        it('document', (): void => {
            const lexer: HTMLLexer = new HTMLLexer('<html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>');
            const parser: HTMLParser = new HTMLParser(lexer);

            expect((): void => {
                parser.document();
            }).not.toThrow();
            expect(parser.getLookaheadType(1)).toBe(EOF_TYPE);
        });

        it('error on wrong close tag', (): void => {
            const lexer: HTMLLexer = new HTMLLexer('<div>foo</span>');
            const parser: HTMLParser = new HTMLParser(lexer);

            expect((): void => {
                parser.document();
            }).toThrow();
        });

        it('error on unexpected close tag', (): void => {
            const lexer: HTMLLexer = new HTMLLexer('<html><body><h1>My First Heading</h1><p>My <strong>first</b> paragraph.</p></body></html>');
            const parser: HTMLParser = new HTMLParser(lexer);

            expect((): void => {
                parser.document();
            }).toThrow();
        });
    });
});
