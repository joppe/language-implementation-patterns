export abstract class ParseTree {
    public children: ParseTree[] = [];

    public addChild(child: ParseTree): void {
        this.children.push(child);
    }
}
