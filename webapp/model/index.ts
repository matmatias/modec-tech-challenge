import { z } from "@/libs";

import { EmployeesSchema } from "./zod/schemas/Employee";
import { mysql } from "@/libs";

type Employee = z.infer<typeof EmployeesSchema.element>;

interface IEmployee extends mysql.RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
  age: number;
}

export { EmployeesSchema };
export type { Employee, IEmployee };
