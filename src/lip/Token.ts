/**
 * @class Token
 */
export class Token {
    /**
     * @type {number}
     * @private
     */
    private _type: number;

    /**
     * @type {string}
     * @private
     */
    private _name: string;

    /**
     * @type {string}
     * @private
     */
    private _text: string;

    /**
     * @returns {number}
     */
    get type(): number {
        return this._type;
    }

    /**
     * @returns {string}
     */
    get text(): string {
        return this._text;
    }

    /**
     * Construct a Token instance.
     *
     * @param {number} type
     * @param {string} name
     * @param {string} text
     */
    public constructor(type: number, name: string, text: string) {
        this._type = type;
        this._name = name;
        this._text = text;
    }

    /**
     * @returns {string}
     */
    public toString(): string {
        return `<${this.text}, ${this._name}>`;
    }
}
