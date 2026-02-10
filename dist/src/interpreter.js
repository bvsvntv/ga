import { FunctionStmt } from './ast.js';
export class Interpreter {
    environment = new Map();
    interpret(statements) {
        for (const statement of statements) {
            this.execute(statement);
        }
    }
    execute(stmt) {
        stmt.accept(this);
    }
    /*
     * Process print statement
     */
    visitPrintStmt(stmt) {
        const value = this.evaluate(stmt.expression);
        console.log(value);
    }
    visitVarStmt(stmt) {
        const value = stmt.initializer !== null ? this.evaluate(stmt.initializer) : null;
        this.environment.set(stmt.name.lexeme, value);
    }
    visitFunctionStmt(stmt) {
        this.environment.set(stmt.name.lexeme, stmt);
    }
    visitBlockStmt(stmt) {
        for (const statement of stmt.statements) {
            this.execute(statement);
        }
    }
    visitExpressionStmt(stmt) {
        this.evaluate(stmt.expression);
    }
    visitLiteralExpr(expr) {
        if (typeof expr.value === 'string' && expr.value.startsWith('"')) {
            return expr.value.slice(1, -1);
        }
        return expr.value;
    }
    visitVariableExpr(expr) {
        const value = this.environment.get(expr.name.lexeme);
        if (value === undefined) {
            throw new Error(`Undefined variable '${expr.name.lexeme}'`);
        }
        return value;
    }
    visitCallExpr(expr) {
        const func = this.environment.get(expr.callee.name.lexeme);
        if (func === undefined) {
            throw new Error(`Undefined function '${expr.callee.name.lexeme}'`);
        }
        if (!(func instanceof FunctionStmt)) {
            throw new Error(`'${expr.callee.name.lexeme}' is not a function`);
        }
        // Create new environment for function scope
        const prevEnvironment = this.environment;
        this.environment = new Map(this.environment);
        // Bind arguments to parameters
        if (expr.args.length !== func.params.length) {
            throw new Error(`Expected ${func.params.length} arguments but got ${expr.args.length}`);
        }
        for (let i = 0; i < func.params.length; i++) {
            const value = this.evaluate(expr.args[i]);
            this.environment.set(func.params[i].lexeme, value);
        }
        // Execute function body
        for (const stmt of func.body) {
            this.execute(stmt);
        }
        // Restore previous environment
        this.environment = prevEnvironment;
        return null;
    }
    /*
     * Evaluate an expression
     */
    evaluate(expr) {
        return expr.accept(this);
    }
}
