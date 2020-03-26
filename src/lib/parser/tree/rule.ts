import { Parser } from '../Parser';

type RuleMethod = () => void;

export function rule(target: Parser, key: string, descriptor: TypedPropertyDescriptor<RuleMethod>): TypedPropertyDescriptor<RuleMethod> {
    const original: RuleMethod = <RuleMethod>descriptor.value ?? <RuleMethod>(target[key]);

    return {
        get(): RuleMethod {
            return (): void => {
                // tslint:disable-next-line no-invalid-this no-unsafe-any
                this.rule(key, original.bind(this));
            };
        },
    };
}
