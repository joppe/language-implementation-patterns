import { ParseTree } from './ParseTree';

export class RuleNode extends ParseTree {
    public name: string;

    public constructor(name: string) {
        super();

        this.name = name;
    }
}
