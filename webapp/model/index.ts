import { z } from "@/libs";

import { EmployeesSchema } from "./zod/schemas/Employee";
import { mysql } from "@/libs/backend";

type Employee = z.infer<typeof EmployeesSchema.element>;

type EmployeeFilter = Omit<Employee, "id" | "age"> & {
  age: string;
};

interface IEmployee extends mysql.RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  department: string;
  age: number;
}

enum SelectOptionsLabelsEnum {
  Default = "Select an Option",
  FirstName = "First Name",
  LastName = "Last name",
  Department = "Department",
  Age = "Age",
}

enum SelectOptionsValuesEnum {
  Default = "",
  FirstName = "first_name",
  LastName = "last_name",
  Department = "department",
  Age = "age",
}

interface SelectOption {
  label: SelectOptionsLabelsEnum;
  value: SelectOptionsValuesEnum;
}

export { EmployeesSchema, SelectOptionsLabelsEnum, SelectOptionsValuesEnum };
export type { Employee, EmployeeFilter, IEmployee, SelectOption };
