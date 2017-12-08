import {EOF, EOF_TYPE, LL1Lexer, TokenTypeReference} from 'app/lip/LL1Lexer';
import {Token} from 'app/lip/Token';

/**
 * http (s) : // subdomain.host.domain /path/to/endpoint .extension ? query # hash
 */

/**
 * Grammar
 * @see https://tools.ietf.org/html/rfc3986#appendix-A
 * @see https://www.w3.org/Addressing/URL/uri-spec.html
 *
 * Inspiration: http://medialize.github.io/URI.js/about-uris.html
 *
 * url: scheme :// hostport / path search hash
 * scheme: http | https
 * hostport: host : port
 * host: hostname | hostnumber
 * hostname: ialpha [. hostname]
 * hostnumber: digits . digits . digits . digits
 * port: digits
 * path: void | segment [ / path ]
 * segment: xpalphas
 * search: xpalphas [+ search]
 * xpalphas: xpalpha [ xpalphas ]
 * xpalpha: xalpha | +
 * ialpha: ALPHA [ xalphas ]
 * xalphas: xalpha [ xalphas ]
 * xalpha: ALPHA | DIGIT | SAFE | EXTRA | ESCAPE
 * digits: digit [digits]
 * ALPHA: ('a'..'z'|'A'..'Z')
 * DIGIT: (0..9)
 * SAFE: ($  -  _  @  .  &  + -)
 * EXTRA: (!  *  "  '  (  )  ,)
 * ESCAPE: % HEX HEX
 * HEX: digit ('a'..'f'|'A'..'F')
 */

/**
 * Available Token types
 *
 * @enum
 */
export enum TokenTypes {
    COLON = 2,
    FSLASH,
    DOT,
    QMARK,
    HASH,
    ALPHA,
    DIGIT,
    SAFE,
    EXTRA,
    ESCAPE,
    HEX
}
