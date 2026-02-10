import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { Lexer } from '../src/lexer.js';
import { Parser } from '../src/parser.js';
import {
  PrintStmt,
  VarStmt,
  FunctionStmt,
  LiteralExpr,
  VariableExpr
} from '../src/ast.js';

describe('Parser', () => {
  test('parse print statement', () => {
    const source: string = `छाप("नमस्ते")`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 1);
    assert.ok(stmts[0] instanceof PrintStmt);
    assert.ok(stmts[0].expression instanceof LiteralExpr);
  });

  test('parse variable declaration with value', () => {
    const source: string = `मानौ क = १०`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 1);
    assert.ok(stmts[0] instanceof VarStmt);
    const varStmt = stmts[0] as VarStmt;
    assert.equal(varStmt.name.lexeme, 'क');
    assert.ok(varStmt.initializer instanceof LiteralExpr);
  });

  test('parse variable declaration without value', () => {
    const source: string = `मानौ क`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 1);
    assert.ok(stmts[0] instanceof VarStmt);
    const varStmt = stmts[0] as VarStmt;
    assert.equal(varStmt.name.lexeme, 'क');
    assert.equal(varStmt.initializer, null);
  });

  test('parse variable declaration with string', () => {
    const source: string = `मानौ सन्देश = "नमस्ते"`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 1);
    assert.ok(stmts[0] instanceof VarStmt);
    const varStmt = stmts[0] as VarStmt;
    assert.equal(varStmt.name.lexeme, 'सन्देश');
    assert.ok(varStmt.initializer instanceof LiteralExpr);
  });

  test('parse print with variable', () => {
    const source: string = `छाप(सन्देश)`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 1);
    assert.ok(stmts[0] instanceof PrintStmt);
    assert.ok(stmts[0].expression instanceof VariableExpr);
    const varExpr = stmts[0].expression as VariableExpr;
    assert.equal(varExpr.name.lexeme, 'सन्देश');
  });

  test('parse multiple statements', () => {
    const source: string = `मानौ क = १०
छाप(क)`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 2);
    assert.ok(stmts[0] instanceof VarStmt);
    assert.ok(stmts[1] instanceof PrintStmt);
  });

  test('parse function declaration without parameters', () => {
    const source: string = `कार्य नमस्कार() {
  छाप("नमस्ते")
}`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 1);
    assert.ok(stmts[0] instanceof FunctionStmt);
    const funcStmt = stmts[0] as FunctionStmt;
    assert.equal(funcStmt.name.lexeme, 'नमस्कार');
    assert.equal(funcStmt.params.length, 0);
    assert.equal(funcStmt.body.length, 1);
  });

  test('parse function declaration with parameters', () => {
    const source: string = `कार्य जोड(अ, ब) {
  छाप(अ)
  छाप(ब)
}`;
    const lexer: Lexer = new Lexer(source.trim());
    const tokens = lexer.readTokens();
    const parser: Parser = new Parser(tokens);
    const stmts = parser.parse();

    assert.equal(stmts.length, 1);
    assert.ok(stmts[0] instanceof FunctionStmt);
    const funcStmt = stmts[0] as FunctionStmt;
    assert.equal(funcStmt.name.lexeme, 'जोड');
    assert.equal(funcStmt.params.length, 2);
    assert.equal(funcStmt.params[0]!.lexeme, 'अ');
    assert.equal(funcStmt.params[1]!.lexeme, 'ब');
    assert.equal(funcStmt.body.length, 2);
  });
});
