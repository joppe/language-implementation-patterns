import { HTMLLexer } from '../../../../src/html/lexer/HTMLLexer';
import { Token } from '../../../../src/lib/token/Token';
import { Types } from '../../../../src/html/token/Types';
import { EOF_TYPE } from '../../../../src/lib/token/Type';

describe('HTMLLexer', (): void => {
    describe('nextToken', (): void => {
        it('return the next tokens', (): void => {
            const input: string = '<span>foo</span>';
            const lexer: HTMLLexer = new HTMLLexer(input);

            const token: Token = lexer.nextToken();

            expect(token.type).toEqual(Types.LT);
            expect(token.text).toEqual('<');
        });
    });

    it('retrieve all tokens', (): void => {
        const input: string = '<span class="bar"><b>foo</b>?</span>';
        const lexer: HTMLLexer = new HTMLLexer(input);
        const tokens: string[] = [];
        let token: Token = lexer.nextToken();

        while (token.type !== EOF_TYPE) {
            tokens.push(token.toString());
            token = lexer.nextToken();
        }

        tokens.push(token.toString());

        expect(tokens).toEqual([
            '<\'<\',LT>',
            '<\'span\',TAG_NAME>',
            '<\'class\',ATTRIBUTE_NAME>',
            '<\'=\',EQUALS>',
            '<\'"\',DBQUOTES>',
            '<\'bar\',ATTRIBUTE_VALUE>',
            '<\'"\',DBQUOTES>',
            '<\'>\',GT>',
            '<\'<\',LT>',
            '<\'b\',TAG_NAME>',
            '<\'>\',GT>',
            '<\'foo\',CONTENT>',
            '<\'<\',LT>',
            '<\'/\',FSLASH>',
            '<\'b\',TAG_NAME>',
            '<\'>\',GT>',
            '<\'?\',CONTENT>',
            '<\'<\',LT>',
            '<\'/\',FSLASH>',
            '<\'span\',TAG_NAME>',
            '<\'>\',GT>',
            '<\'<EOF>\',<EOF>>',
        ]);
    });
});
