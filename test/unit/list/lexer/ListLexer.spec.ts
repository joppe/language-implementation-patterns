import { ListLexer } from '../../../../src/list/lexer/ListLexer';
import { Token } from '../../../../src/lib/token/Token';
import { Types } from '../../../../src/list/token/Types';
import { EOF_TYPE } from '../../../../src/lib/token/Type';

describe('ListLexer', (): void => {
    describe('nextToken', (): void => {
        it('return the next tokens', (): void => {
            const input: string = '[a,b]';
            const lexer: ListLexer = new ListLexer(input);
            const token: Token = lexer.nextToken();

            expect(token.type).toEqual(Types.LBRACK);
            expect(token.text).toEqual('[');
        });

        it('proceeds to next token', (): void => {
            const input: string = '[a,b]';
            const lexer: ListLexer = new ListLexer(input);

            lexer.nextToken();

            const token: Token = lexer.nextToken();

            expect(token.type).toEqual(Types.NAME);
            expect(token.text).toEqual('a');

        });
    });

    describe('getTokenName', (): void => {
        it('return the name of the token type', (): void => {
            const input: string = '[a,b]';
            const lexer: ListLexer = new ListLexer(input);
            const token: Token = lexer.nextToken();

            expect(lexer.getTokenName(token.type)).toEqual('LBRACK');
        });
    });

    it('ignores whitespace', (): void => {
        const input: string = '            [        a , b]';
        const lexer: ListLexer = new ListLexer(input);
        const token: Token = lexer.nextToken();

        expect(token.type).toEqual(Types.LBRACK);
        expect(token.text).toEqual('[');
    });

    it('retrieve all tokens', (): void => {
        const input: string = '            [        a , b]';
        const lexer: ListLexer = new ListLexer(input);
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