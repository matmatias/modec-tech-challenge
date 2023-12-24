import { Employee } from "@/model";
import { pool } from "@/connect";

interface IEmployeeRepository {
  getAll(): Promise<Employee[]>;
  getByQuery(searchParams: URLSearchParams): Promise<Employee[]>;
}

export class EmployeeRepository implements IEmployeeRepository {
  async getAll(): Promise<Employee[]> {
    const [rows] = await pool.query("SELECT * FROM employees");
    const employees = rows as Employee[];

    // if (!EmployeesSchema.safeParse(employees).success) {
    //   throw "Bad Data";
    // }

    return employees;
  }

  async getByQuery(searchParams: URLSearchParams): Promise<Employee[]> {
    const sqlQuery = this.getSqlQueryFromSearchParams(searchParams);

    if (!sqlQuery) {
      return [];
    }

    const [rows] = await pool.query(sqlQuery.query, sqlQuery.values);
    const employees = rows as Employee[];

    // if (!EmployeesSchema.safeParse(employees).success) {
    //   throw "Bad Data";
    // }

    return employees;
  }

  private getSqlQueryFromSearchParams(searchParams: URLSearchParams): {
    query: string;
    values: string[];
  } | null {
    let parsedParams = this.getParsedSearchParams(searchParams);

    const parsedParamsKeys = Object.keys(parsedParams);
    const validSearchParamsQty = parsedParamsKeys.length;

    if (validSearchParamsQty === 0) {
      return null;
    }

    if (validSearchParamsQty === 1) {
      const key = parsedParamsKeys[0];
      const values = [parsedParams[key]];
      return {
        query: `SELECT * FROM employees WHERE ${this.parseKey(key)} = ?`,
        values: values,
      };
    }

    let query = "SELECT * FROM employees WHERE";
    const values: string[] = [];
    for (let i = 0; i < parsedParamsKeys.length; ++i) {
      const key = parsedParamsKeys[i];
      const value = parsedParams[key];

      if (i === parsedParamsKeys.length - 1) {
        query += ` ${key} = ?`;
        values.push(value);
        continue;
      }

      const operator = key === "age" ? "=" : "LIKE";
      query += ` ${key} ${operator} ? AND`;
      values.push(value);
    }

    return { query: query, values: values };
  }

  private getParsedSearchParams(searchParams: URLSearchParams): {
    [key: string]: string;
  } {
    let parsedSearchParams: { [key: string]: string } = {};
    for (let key of searchParams.keys()) {
      if (!this.parseKey(key)) {
        continue;
      }

      parsedSearchParams[this.parseKey(key)!] = searchParams.get(key)!;
    }

    return parsedSearchParams;
  }

  /* This is necessary to prevent SQL Injection attacks */
  private parseKey(key: string): string | undefined {
    switch (key) {
      case "first_name":
        return "first_name";
      case "last_name":
        return "last_name";
      case "department":
        return "department";
      case "age":
        return "age";
      default:
        return undefined;
    }
  }
}
