export class Token {
    public readonly name: string | undefined;
    public readonly text: string;
    public readonly type: number;

    public constructor(type: number, name?: string, text: string = '') {
        this.name = name;
        this.text = text;
        this.type = type;
    }

    public toString(): string {
        return `<'${this.text}',${this.name}>`;
    }
}
