export enum TokenKind {
  Eof = 'Eof',
  Illegal = 'Illegal',

  /* -- Punctuation/Delimiters -- */
  Comma = 'Comma',
  Colon = 'Colon',
  Period = 'Period',
  Semicolon = 'Semicolon',
  OpenParen = 'OpenParen',
  CloseParen = 'CloseParen',
  OpenCurly = 'OpenCurly',
  CloseCurly = 'CloseCurly',

  /* -- Operators -- */
  Plus = 'Plus',
  Minus = 'Minus',
  Star = 'Star',
  Slash = 'Slash',
  Mod = 'Mod',
  Bang = 'Bang',
  Equal = 'Equal',

  /* -- Literals -- */
  Number = 'Number',
  Character = 'Character',
  String = 'String',
  Identifier = 'Identifier',

  /* -- Keywords -- */
  Let = 'Let',
  Function = 'Function',
  Print = 'Print',
  Return = 'Return',
  If = 'If',
  Else = 'Else',
  True = 'True',
  False = 'False'
}

export const keywords: Record<string, TokenKind> = {
  मानौ: TokenKind.Let,
  कार्य: TokenKind.Function,
  छाप: TokenKind.Print,
  यदि: TokenKind.If,
  नभए: TokenKind.Else,
  फिर्ता: TokenKind.Return,
  सत्य: TokenKind.True,
  असत्य: TokenKind.False
};

export class Token {
  kind: TokenKind;
  lexeme: string;

  constructor(kind: TokenKind, lexeme: string) {
    this.kind = kind;
    this.lexeme = lexeme;
  }
}
