import {
  FunctionStmt,
  type BlockStmt,
  type CallExpr,
  type ExpressionStmt,
  type Expr,
  type ExprVisitor,
  type LiteralExpr,
  type PrintStmt,
  type Stmt,
  type StmtVisitor,
  type VariableExpr,
  type VarStmt
} from './ast.js';

export class Interpreter implements ExprVisitor<any>, StmtVisitor<void> {
  private environment: Map<string, any> = new Map();

  interpret(statements: Stmt[]): void {
    for (const statement of statements) {
      this.execute(statement);
    }
  }

  private execute(stmt: Stmt): void {
    stmt.accept(this);
  }

  /*
   * Process print statement
   */
  visitPrintStmt(stmt: PrintStmt): void {
    const value = this.evaluate(stmt.expression);
    console.log(value);
  }

  visitVarStmt(stmt: VarStmt): void {
    const value =
      stmt.initializer !== null ? this.evaluate(stmt.initializer) : null;
    this.environment.set(stmt.name.lexeme, value);
  }

  visitFunctionStmt(stmt: FunctionStmt): void {
    this.environment.set(stmt.name.lexeme, stmt);
  }

  visitBlockStmt(stmt: BlockStmt): void {
    for (const statement of stmt.statements) {
      this.execute(statement);
    }
  }

  visitExpressionStmt(stmt: ExpressionStmt): void {
    this.evaluate(stmt.expression);
  }

  visitLiteralExpr(expr: LiteralExpr): any {
    if (typeof expr.value === 'string' && expr.value.startsWith('"')) {
      return expr.value.slice(1, -1);
    }

    return expr.value;
  }

  visitVariableExpr(expr: VariableExpr): any {
    const value = this.environment.get(expr.name.lexeme);
    if (value === undefined) {
      throw new Error(`Undefined variable '${expr.name.lexeme}'`);
    }
    return value;
  }

  visitCallExpr(expr: CallExpr): any {
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
      throw new Error(
        `Expected ${func.params.length} arguments but got ${expr.args.length}`
      );
    }

    for (let i = 0; i < func.params.length; i++) {
      const value = this.evaluate(expr.args[i]!);
      this.environment.set(func.params[i]!.lexeme, value);
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
  private evaluate(expr: Expr): any {
    return expr.accept(this);
  }
}
