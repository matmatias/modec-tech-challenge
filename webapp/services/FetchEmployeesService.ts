import { WEBAPP_URL } from "@/http";
import { Employee, EmployeeFilter } from "@/model";

const ENDPOINT = "api/employees";

interface IFetchEmployees {
  byFilter(filter: EmployeeFilter): Promise<Employee[]>;
}

export class FetchEmployeesService implements IFetchEmployees {
  async byFilter(filter: EmployeeFilter): Promise<Employee[]> {
    const nonEmptyFilter: Partial<EmployeeFilter> =
      this.getNonEmptyFilter(filter);
    const searchParams: string = this.getSearchParams(nonEmptyFilter);

    const requestUrl = `${WEBAPP_URL}/${ENDPOINT}?${searchParams}`;
    // const requestUrl = `http://localhost:3000/api/employees?${searchParams}`;
    const response = await fetch(requestUrl);
    const employees: Employee[] = (await response.json()) as Employee[];

    // if (!EmployeesSchema.safeParse(employees).success) {
    //   throw "Bad data from the server";
    // }

    return employees;
  }

  private getNonEmptyFilter(filter: EmployeeFilter): Partial<EmployeeFilter> {
    const filterKeys = Object.keys(filter);
    const parsedFilter: Partial<EmployeeFilter> = {};
    for (let i = 0; i < filterKeys.length; ++i) {
      const key = filterKeys[i] as keyof EmployeeFilter;
      const value = filter[key];

      if (value !== "") {
        parsedFilter[key] = value;
      }
    }

    return parsedFilter;
  }

  private getSearchParams(filter: Partial<EmployeeFilter>): string {
    let searchParams = "";
    const filterKeys = Object.keys(filter);
    for (let i = 0; i < filterKeys.length; ++i) {
      const filterKey = filterKeys[i] as keyof EmployeeFilter;
      const filterValue = filter[filterKey];

      if (i === filterKeys.length - 1) {
        searchParams += `${filterKey}=${filterValue}`;
        continue;
      }

      searchParams += `${filterKey}=${filterValue}&`;
    }

    return searchParams;
  }
}
