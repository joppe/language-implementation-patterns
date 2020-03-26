import { ParseTree } from './ParseTree';
import { Token } from '../../token/Token';

export class TokenNode extends ParseTree {
    public token: Token;

    constructor(token: Token) {
        super();

        this.token = token;
    }
}
