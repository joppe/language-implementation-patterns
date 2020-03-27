import { LL1ListLexer } from '@apestaartje/lip/list/lexer/LL1ListLexer';
import { Token } from '@apestaartje/lip/lib/token/Token';
import { TokenTypes } from '@apestaartje/lip/list/token/TokenTypes';
import { EOF_TYPE } from '@apestaartje/lip/lib/token/TokenType';

describe('LL1ListLexer', (): void => {
    describe('nextToken', (): void => {
        it('return the next tokens', (): void => {
            const input: string = '[a,b]';
            const lexer: LL1ListLexer = new LL1ListLexer(input);
            const token: Token = lexer.nextToken();

            expect(token.type).toEqual(TokenTypes.LBRACK);
            expect(token.text).toEqual('[');
        });

        it('proceeds to next token', (): void => {
            const input: string = '[a,b]';
            const lexer: LL1ListLexer = new LL1ListLexer(input);

            lexer.nextToken();

            const token: Token = lexer.nextToken();

            expect(token.type).toEqual(TokenTypes.NAME);
            expect(token.text).toEqual('a');

        });
    });

    describe('getTokenName', (): void => {
        it('return the name of the token type', (): void => {
            const input: string = '[a,b]';
            const lexer: LL1ListLexer = new LL1ListLexer(input);
            const token: Token = lexer.nextToken();

            expect(lexer.getTokenName(token.type)).toEqual('LBRACK');
        });
    });

    it('ignores whitespace', (): void => {
        const input: string = '            [        a , b]';
        const lexer: LL1ListLexer = new LL1ListLexer(input);
        const token: Token = lexer.nextToken();

        expect(token.type).toEqual(TokenTypes.LBRACK);
        expect(token.text).toEqual('[');
    });

    it('retrieve all tokens', (): void => {
        const input: string = '            [        a , b]';
        const lexer: LL1ListLexer = new LL1ListLexer(input);
        const tokens: string[] = [];
        let token: Token = lexer.nextToken();

        while (token.type !== EOF_TYPE) {
            tokens.push(token.toString());
            token = lexer.nextToken();
        }

        tokens.push(token.toString());

        expect(tokens).toEqual([
            '<\'[\',LBRACK>',
            '<\'a\',NAME>',
            '<\',\',COMMA>',
            '<\'b\',NAME>',
            '<\']\',RBRACK>',
            '<\'<EOF>\',<EOF>>',
        ]);
    });
});
