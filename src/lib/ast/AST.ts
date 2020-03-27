import { Buffer } from '../string/Buffer';
import { Token } from '../token/Token';

export class AST {
    public readonly token: Token | undefined;
    public readonly children: AST[] = [];

    public constructor(token?: Token) {
        this.token = token;
    }

    public getNodeType(): number | undefined {
        return this.token?.type;
    }

    public addChild(child: AST): void {
        this.children.push(child);
    }

    public isNil(): boolean {
        return this.token === undefined;
    }

    public toString(): string {
        if (this.isNil()) {
            return 'nil';
        }

        return (<Token>this.token).text;
    }

    public toStringTree(): string {
        if (this.children.length === 0) {
            return this.toString();
        }

        const buffer: Buffer = new Buffer();

        if (!this.isNil()) {
            buffer.append('(');
            buffer.append(this.toString());
            buffer.append(' ');
        }

        this.children.forEach((child: AST, index: number): void => {
            if (index > 0) {
                buffer.append(' ');
            }

            buffer.append(child.toStringTree());
        });

        if (!this.isNil()) {
            buffer.append(')');
        }

        return buffer.toString();
    }
}
