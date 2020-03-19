export enum Vocabulary {
    BSLASH = '\\',
    DBQUOTES = '"',
    EQUALS = '=',
    FSLASH = '/',
    GT = '>',
    LT = '<',
    MINUS = '-',
    UNDERSCORE = '_',
}

export const WHITESPACE_RE: RegExp = /\s/;

export const SELF_CLOSING_TAGS: string[] = [
    'area',
    'base',
    'br',
    'embed',
    'hr',
    'iframe',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
];
