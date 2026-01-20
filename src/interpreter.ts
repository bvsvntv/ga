import type {
  Expr,
  ExprVisitor,
  LiteralExpr,
  PrintStmt,
  Stmt,
  StmtVisitor,
  VariableExpr,
  VarStmt
} from './ast.js';

export class Interpreter implements ExprVisitor<any>, StmtVisitor<void> {
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
    // TODO: yet to implement
  }

  visitLiteralExpr(expr: LiteralExpr): any {
    if (typeof expr.value === 'string' && expr.value.startsWith('"')) {
      return expr.value.slice(1, -1);
    }

    return expr.value;
  }

  visitVariableExpr(expr: VariableExpr): any {
    // TODO: yet to implement
  }

  /*
   * Evaluate an expression
   */
  private evaluate(expr: Expr): any {
    return expr.accept(this);
  }
}
