import { BacktrackParser } from './BacktrackParser';

const UNKNOWN: undefined = undefined;
const FAILED: number = -1;

type Memo = {[index: number]: number};

export abstract class MemoizingParser extends BacktrackParser {
    protected memo: {[rule: string]: Memo} = {};

    public consume(): void {
        this.pointer += 1;

        if ((this.pointer === this.lookahead.length) && !this.isSpeculating()) {
            this.pointer = 0;

            this.lookahead = [];
            this.memo = {};
        }

        this.sync(1);
    }

    protected memoizeRule(ruleName: string, rule: () => void): void {
        let isFailed: boolean = false;
        const startTokenIndex: number = this.pointer;

        if (this.isSpeculating() && this.isAlreadyParsedRule(ruleName)) {
            return;
        }

        try {
            rule();
        } catch (e) {
            isFailed = true;

            throw e;
        } finally {
            if (this.isSpeculating()) {
                this.memoize(ruleName, startTokenIndex, isFailed);
            }
        }
    }

    private isAlreadyParsedRule(ruleName: string): boolean {
        if (this.memo[ruleName] === UNKNOWN || this.memo[ruleName][this.pointer] === UNKNOWN) {
            return false;
        }

        const index: number = this.memo[ruleName][this.pointer];

        if (index === FAILED) {
            throw new Error('Previously parsed rule failed');
        }

        this.seek(index);

        return true;
    }

    private memoize(ruleName: string, index: number, isFailed: boolean): void {
        if (this.memo[ruleName] === undefined) {
            this.memo[ruleName] = [];
        }

        this.memo[ruleName][index] = isFailed ? FAILED : this.pointer;
    }
}
