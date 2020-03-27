import { EOF_TYPE } from '../../lib/token/TokenType';
import { TokenTypeReference } from '../../lib/token/TokenTypeReference';
import { TokenTypes } from './TokenTypes';

export const TokenNames: TokenTypeReference = {
    [EOF_TYPE]: '<EOF>',
    [TokenTypes.LT]: 'LT',
    [TokenTypes.GT]: 'GT',
    [TokenTypes.BSLASH]: 'BSLASH',
    [TokenTypes.FSLASH]: 'FSLASH',
    [TokenTypes.EQUALS]: 'EQUALS',
    [TokenTypes.DBQUOTES]: 'DBQUOTES',
    [TokenTypes.TAG_NAME]: 'TAG_NAME',
    [TokenTypes.ATTRIBUTE_NAME]: 'ATTRIBUTE_NAME',
    [TokenTypes.ATTRIBUTE_VALUE]: 'ATTRIBUTE_VALUE',
    [TokenTypes.CONTENT]: 'CONTENT',
};
