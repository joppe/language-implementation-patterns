export class Buffer {
    private _string: string = '';

    public append(str: string): void {
        this._string += str;
    }

    public length(): number {
        return this._string.length;
    }

    public clear(): void {
        this._string = '';
    }

    public toString(): string {
        return this._string;
    }
}
