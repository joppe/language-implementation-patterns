import { Token } from '../token/Token';

export interface Lexer {
    match(char: string): void;
    nextToken(): Token;
    getTokenName(type: number): string;
}
