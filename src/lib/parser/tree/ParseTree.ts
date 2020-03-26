import { Token } from '../../token/Token';

export abstract class ParseTree {
    public children: ParseTree[] = [];

    public addRuleChild(rule: string): ParseTree {
        const child: RuleNode = new RuleNode(rule);

        this.addChild(child);

        return child;
    }

    public addTokenChild(token: Token): ParseTree {
        const child: TokenNode = new TokenNode(token);

        this.addChild(child);

        return child;
    }

    public addChild(child: ParseTree): void {
        this.children.push(child);
    }
}

export class RuleNode extends ParseTree {
    public name: string;

    public constructor(name: string) {
        super();

        this.name = name;
    }
}

export class TokenNode extends ParseTree {
    public token: Token;

    constructor(token: Token) {
        super();

        this.token = token;
    }
}
