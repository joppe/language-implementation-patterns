import { EOF_TYPE } from '../../lib/token/Type';
import { TypeReference } from '../../lib/token/TypeReference';
import { Types } from './Types';

export const Names: TypeReference = {
    [EOF_TYPE]: '<EOF>',
    [Types.LT]: 'LT',
    [Types.GT]: 'GT',
    [Types.BSLASH]: 'BSLASH',
    [Types.FSLASH]: 'FSLASH',
    [Types.EQUALS]: 'EQUALS',
    [Types.DBQUOTES]: 'DBQUOTES',
    [Types.TAG_NAME]: 'TAG_NAME',
    [Types.ATTRIBUTE_NAME]: 'ATTRIBUTE_NAME',
    [Types.ATTRIBUTE_VALUE]: 'ATTRIBUTE_VALUE',
    [Types.CONTENT]: 'CONTENT',
};
