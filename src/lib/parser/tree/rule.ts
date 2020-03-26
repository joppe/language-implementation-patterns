import { Parser } from '../Parser';

type RuleMethod = () => void;

export function rule(target: Parser, key: string, descriptor: TypedPropertyDescriptor<RuleMethod>): TypedPropertyDescriptor<RuleMethod> {
    const original: () => void = descriptor.value ?? (target[key]);

    // descriptor.value = (): void => {
    //     console.log(this);
    //     original.call(target);
    // };

    // return descriptor;

    return {
        get(): RuleMethod {
            return (): void => {
                // tslint:disable-next-line no-invalid-this
                this.rule(key, original.bind(this));
            };
        },
    };
}
