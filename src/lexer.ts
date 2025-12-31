import { keywords, Token, TokenKind } from './token.js';

export class Lexer {
  private source: string;
  private tokens: Token[];
  private startPosition: number;
  private currentPosition: number;
  private line: number;

  constructor(source: string) {
    this.source = source;
    this.tokens = [];
    this.startPosition = 0;
    this.currentPosition = 0;
    this.line = 1;
  }

  /**
   * Read tokens from source
   */
  readTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.startPosition = this.currentPosition;
      this.readToken();
    }

    return this.tokens;
  }

  /**
   * Read individual lexeme
   */
  readToken(): void {
    const char = this.readChar();

    switch (char) {
      case ',':
        this.createToken(TokenKind.Comma);
        break;
      case ':':
        this.createToken(TokenKind.Colon);
        break;
      case '.':
        this.createToken(TokenKind.Period);
        break;
      case ';':
        this.createToken(TokenKind.Semicolon);
        break;
      case '(':
        this.createToken(TokenKind.OpenParen);
        break;
      case ')':
        this.createToken(TokenKind.CloseParen);
        break;
      case '{':
        this.createToken(TokenKind.OpenCurly);
        break;
      case '}':
        this.createToken(TokenKind.CloseCurly);
        break;
      case '+':
        this.createToken(TokenKind.Plus);
        break;
      case '-':
        this.createToken(TokenKind.Minus);
        break;
      case '*':
        this.createToken(TokenKind.Star);
        break;
      case '/':
        this.createToken(TokenKind.Slash);
        break;
      case '%':
        this.createToken(TokenKind.Mod);
        break;
      case '!':
        this.createToken(TokenKind.Bang);
        break;
      case '=':
        this.createToken(TokenKind.Equal);
        break;
      case '\0':
        this.createToken(TokenKind.Eof);
        break;

      /* Handle whitespaces */
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++;
        break;
      default:
        if (this.isDevnagariChar(char)) {
          if (this.isDevanagariDigit(char)) this.readDevanagariDigit();
          else this.readDevanagariIdentifier();
        }
        break;
    }
  }

  /**
   * Read character
   */
  readChar(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.currentPosition++);
  }

  /**
   * Create token out of individual lexeme
   * @param {TokenKind} kind
   * @param {any} literal
   */
  createToken(kind: TokenKind, literal?: any): void {
    if (literal === undefined) literal = null;
    const text = this.source.substring(
      this.startPosition,
      this.currentPosition
    );
    this.tokens.push(new Token(kind, text));
  }

  /**
   * Check if we've reached the end of file
   */
  private isAtEnd(): boolean {
    return this.currentPosition >= this.source.length;
  }

  /**
   * Peek next character
   */
  private peekNextChar(): string {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.currentPosition);
  }

  /**
   * Get next character
   */
  private getNextChar(): string {
    return this.source.charAt(this.currentPosition++);
  }

  /**
   * Check if the character is devanagari character
   * @param {string} char
   */
  private isDevnagariChar(char: string): boolean {
    return (
      ('\u{0900}' <= char && char <= '\u{097F}') ||
      ('\u{A8E0}' <= char && char <= '\u{A8FF}')
    );
  }

  /**
   * Check if the character is devanagari digit
   * @param {string} char
   */
  private isDevanagariDigit(char: string): boolean {
    return '\u{0966}' <= char && char <= '\u{096F}';
  }

  /**
   * Read devanagari character sequence as number
   */
  private readDevanagariDigit(): void {
    while (this.isDevanagariDigit(this.peekNextChar())) this.getNextChar();
    const content = this.source.substring(
      this.startPosition,
      this.currentPosition
    );

    this.createToken(TokenKind.Number, content);
  }

  /**
   * Read devanagari character sequence as identifier
   */
  private readDevanagariIdentifier(): void {
    while (this.isDevnagariChar(this.peekNextChar())) this.getNextChar();
    const content = this.source.substring(
      this.startPosition,
      this.currentPosition
    );

    const keywordKind = keywords[content];
    if (keywordKind) this.createToken(keywordKind, content);
    else this.createToken(TokenKind.Identifier, content);
  }
}
