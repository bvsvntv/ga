import { BlockStmt, CallExpr, ExpressionStmt, FunctionStmt, LiteralExpr, PrintStmt, VarStmt, VariableExpr } from './ast.js';
import { TokenKind } from './token.js';
export class Parser {
    tokens;
    currentPos;
    constructor(tokens) {
        this.tokens = tokens;
        this.currentPos = 0;
    }
    parse() {
        const stmts = [];
        while (!this.isAtEnd()) {
            stmts.push(this.parseStmt());
        }
        return stmts;
    }
    parseStmt() {
        if (this.match(TokenKind.Print)) {
            return this.parsePrintStmt();
        }
        if (this.match(TokenKind.Let)) {
            return this.parseVarStmt();
        }
        if (this.match(TokenKind.Function)) {
            return this.parseFunctionStmt();
        }
        return this.parseExpressionStmt();
    }
    parseExpressionStmt() {
        const expr = this.parseExpression();
        return new ExpressionStmt(expr);
    }
    parsePrintStmt() {
        this.consume(TokenKind.OpenParen, "Expect '(' after 'छाप'");
        const expr = this.parseExpression();
        this.consume(TokenKind.CloseParen, "Expect ')' after expression");
        return new PrintStmt(expr);
    }
    parseVarStmt() {
        const name = this.consume(TokenKind.Identifier, "Expect variable name after 'मानौ'");
        let initializer = null;
        if (this.match(TokenKind.Equal)) {
            initializer = this.parseExpression();
        }
        return new VarStmt(name, initializer);
    }
    parseFunctionStmt() {
        const name = this.consume(TokenKind.Identifier, "Expect function name after 'कार्य'");
        this.consume(TokenKind.OpenParen, "Expect '(' after function name");
        const params = [];
        if (!this.check(TokenKind.CloseParen)) {
            do {
                params.push(this.consume(TokenKind.Identifier, 'Expect parameter name'));
            } while (this.match(TokenKind.Comma));
        }
        this.consume(TokenKind.CloseParen, "Expect ')' after parameters");
        this.consume(TokenKind.OpenCurly, "Expect '{' before function body");
        const body = this.parseBlock();
        return new FunctionStmt(name, params, body);
    }
    parseBlock() {
        const statements = [];
        while (!this.check(TokenKind.CloseCurly) && !this.isAtEnd()) {
            statements.push(this.parseStmt());
        }
        this.consume(TokenKind.CloseCurly, "Expect '}' after block");
        return statements;
    }
    parseExpression() {
        return this.parseCall();
    }
    parseCall() {
        let expr = this.parsePrimary();
        while (this.match(TokenKind.OpenParen)) {
            const args = [];
            if (!this.check(TokenKind.CloseParen)) {
                do {
                    args.push(this.parseExpression());
                } while (this.match(TokenKind.Comma));
            }
            this.consume(TokenKind.CloseParen, "Expect ')' after arguments");
            if (expr instanceof VariableExpr) {
                expr = new CallExpr(expr, args);
            }
            else {
                throw this.error(this.previous(), 'Can only call functions');
            }
        }
        return expr;
    }
    parsePrimary() {
        if (this.match(TokenKind.String, TokenKind.Number)) {
            return new LiteralExpr(this.previous().lexeme);
        }
        if (this.match(TokenKind.Identifier)) {
            return new VariableExpr(this.previous());
        }
        throw this.error(this.peek(), 'Expression expected.');
    }
    match(...kinds) {
        for (const kind of kinds) {
            if (this.check(kind)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    consume(kind, message) {
        if (this.check(kind))
            return this.advance();
        throw this.error(this.peek(), message);
    }
    check(kind) {
        if (this.isAtEnd())
            return false;
        return this.peek().kind === kind;
    }
    advance() {
        if (!this.isAtEnd())
            this.currentPos++;
        return this.previous();
    }
    peek() {
        return this.tokens[this.currentPos];
    }
    previous() {
        return this.tokens[this.currentPos - 1];
    }
    isAtEnd() {
        return this.peek().kind === TokenKind.Eof;
    }
    error(token, message) {
        return new Error(`> [line ${token.line}] Error: ${message}`);
    }
}
