import { readFileSync } from 'node:fs';
import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

const source = readFileSync(process.cwd() + '/examples/init.ga', 'utf-8');
const lexer = new Lexer(source);
const tokens = lexer.readTokens();

const parser = new Parser(tokens);
const stmts = parser.parse();

const interpreter = new Interpreter();
interpreter.interpret(stmts);
