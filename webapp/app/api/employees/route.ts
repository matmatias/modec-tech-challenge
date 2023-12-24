import { NextRequest, NextResponse } from "next/server";
import { Employee } from "@/model";
import { EmployeeRepository } from "./Repository";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repository = new EmployeeRepository();

  try {
    const employees: Employee[] = isSearchParamsEmpty(searchParams)
      ? await repository.getAll()
      : await repository.getByQuery(searchParams);

    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: error, status: 500 });
  }
}

function isSearchParamsEmpty(searchParams: URLSearchParams): boolean {
  return [...searchParams.entries()].length === 0 ? true : false;
}
