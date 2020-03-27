import { AST } from '@apestaartje/lip/lib/ast/AST';
import { Token } from '@apestaartje/lip/lib/token/Token';

describe('AST', (): void => {
    enum TokenType {
        PLUS,
        INT,
    }

    describe('toString', (): void => {
        it('with a token', (): void => {
            const plus: Token = new Token(TokenType.PLUS, 'plus', '+');
            const ast: AST = new AST(plus);

            expect(ast.toString()).toEqual('+');
        });

        it('without token', (): void => {
            const ast: AST = new AST();

            expect(ast.toString()).toBe('nil');
        });
    });

    describe('toStringTree', (): void => {
        it('with root node', (): void => {
            const plus: Token = new Token(TokenType.PLUS, 'plus', '+');
            const one: Token = new Token(TokenType.INT, 'int', '1');
            const two: Token = new Token(TokenType.INT, 'int', '2');
            const ast: AST = new AST(plus);

            ast.addChild(new AST(one));
            ast.addChild(new AST(two));

            expect(ast.toStringTree()).toEqual('(+ 1 2)');
        });

        it('without root node', (): void => {
            const one: Token = new Token(TokenType.INT, 'int', '1');
            const two: Token = new Token(TokenType.INT, 'int', '2');
            const ast: AST = new AST();

            ast.addChild(new AST(one));
            ast.addChild(new AST(two));

            expect(ast.toStringTree()).toEqual('1 2');
        });
    });
});
