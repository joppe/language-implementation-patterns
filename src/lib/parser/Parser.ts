export interface Parser {
    match(type: number): void;
    consume(): void;
}
