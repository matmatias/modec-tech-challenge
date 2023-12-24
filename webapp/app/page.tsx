"use client";

import type { Employee } from "@/model";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

type EmployeeFilter = Omit<Employee, "id" | "age"> & {
  age: string;
};

export default function Home() {
  const [employeeFilter, setEmployeeFilter] = useState<EmployeeFilter>({
    first_name: "",
    last_name: "",
    department: "",
    age: "",
  });
  const [filtersQty, setFiltersQty] = useState<number>(1);
  // const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  console.log(employeeFilter);

  return (
    <Fragment>
      <header className="flex flex-row">
        <div>MODEC</div>
        <h1>Employee Search</h1>
        <div>Welcome, Fulano!</div>
      </header>
      <div>English</div>
      <main>
        <div>
          <p>Select Filters:</p>
          <div className="flex flex-col">
            {Array.from({ length: filtersQty }).map((_, index: number) => (
              <div className="flex flex-row" key={index}>
                <Filter
                  employeeFilter={employeeFilter}
                  setEmployeeFilter={setEmployeeFilter}
                />
                {isLastFilter(index, filtersQty) && (
                  <div>
                    <button
                      disabled={isFiltersQtyMax(filtersQty)}
                      onClick={() => setFiltersQty((prev) => prev + 1)}
                    >
                      +
                    </button>
                    <button
                      disabled={isFiltersQtyMin(filtersQty)}
                      onClick={() => setFiltersQty((prev) => prev - 1)}
                    >
                      -
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-row">
            <button>Search</button>
            <button>Clear</button>
          </div>
        </div>
      </main>
    </Fragment>
  );
}

enum SelectOptions {
  FirstName = "first_name",
  LastName = "last_name",
  Department = "department",
  Age = "age",
}

interface FilterProps {
  employeeFilter: EmployeeFilter;
  setEmployeeFilter: Dispatch<SetStateAction<EmployeeFilter>>;
}

function Filter({ employeeFilter, setEmployeeFilter }: FilterProps) {
  const [selected, setSelected] = useState<keyof EmployeeFilter | "">("");

  useEffect(() => {
    return () => {
      if (selected !== "") {
        resetFilterProp(selected, setEmployeeFilter);
      }
    };
  }, []);

  return (
    <Fragment>
      <select
        value={selected}
        onChange={(evt) => {
          if (selected !== "") {
            resetFilterProp(selected, setEmployeeFilter);
          }
          setSelected(evt.target.value as SelectOptions);
        }}
      >
        <option defaultValue="" disabled value={""}>
          Select an option
        </option>
        <option value={SelectOptions.FirstName}>First Name</option>
        <option value={SelectOptions.LastName}>Last Name</option>
        <option value={SelectOptions.Department}>Department</option>
        <option value={SelectOptions.Age}>Age</option>
      </select>
      {selected !== "" && (
        <input
          value={employeeFilter[selected]}
          onChange={(evt) => {
            const selectedFilterProp = { [selected]: evt.target.value };
            setEmployeeFilter((prev) => ({
              ...prev,
              ...selectedFilterProp,
            }));
          }}
        />
      )}
    </Fragment>
  );
}

function resetFilterProp(
  selected: keyof EmployeeFilter,
  setEmployeeFilter: Dispatch<SetStateAction<EmployeeFilter>>,
): void {
  const resetedFilterProp = { [selected]: "" };
  setEmployeeFilter((prev) => ({ ...prev, ...resetedFilterProp }));
}

function isFiltersQtyMax(filtersQty: number): boolean {
  return filtersQty < 4 ? false : true;
}

function isFiltersQtyMin(filtersQty: number): boolean {
  return filtersQty > 1 ? false : true;
}

function isLastFilter(index: number, filtersQty: number): boolean {
  return index === filtersQty - 1 ? true : false;
}
