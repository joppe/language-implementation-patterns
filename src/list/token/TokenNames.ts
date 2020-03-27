import { EOF_TYPE } from '../../lib/token/TokenType';
import { TokenTypeReference } from '../../lib/token/TokenTypeReference';
import { TokenTypes } from './TokenTypes';

export const TokenNames: TokenTypeReference = {
    [EOF_TYPE]: '<EOF>',
    [TokenTypes.NAME]: 'NAME',
    [TokenTypes.EQAULS]: 'EQAULS',
    [TokenTypes.COMMA]: 'COMMA',
    [TokenTypes.LBRACK]: 'LBRACK',
    [TokenTypes.RBRACK]: 'RBRACK',
};
