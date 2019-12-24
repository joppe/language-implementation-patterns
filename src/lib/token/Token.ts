export class Token {
    private readonly _name: string;

    private readonly _text: string;

    /**
     * Symbol category
     */
    private readonly _type: number;

    public constructor(type: number, name: string, text: string) {
        this._type = type;
        this._name = name;
        this._text = text;
    }

    public get type(): number {
        return this._type;
    }

    public text(): string {
        return this._text;
    }

    public toString(): string {
        return `<${this._text},${this._name}>`;
    }
}
