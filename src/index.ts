import { readFileSync } from 'node:fs';
import { Lexer } from './lexer.js';

const source = readFileSync(process.cwd() + '/examples/init.ga', 'utf-8');
const lexer = new Lexer(source);
const tokens = lexer.readTokens();

console.table(tokens);
