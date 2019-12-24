import { EOF_TYPE } from '../../lib/token/Type';
import { TypeReference } from '../../lib/token/TypeReference';
import { Types } from './Types';

export const Names: TypeReference = {
    [EOF_TYPE]: '<EOF>',
    [Types.NAME]: 'NAME',
    [Types.COMMA]: 'COMMA',
    [Types.LBRACK]: 'LBRACK',
    [Types.RBRACK]: 'RBRACK',
};
