import { z } from "@/libs";

export const EmployeesSchema = z.array(
  z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    department: z.string(),
    age: z.number(),
  }),
);
