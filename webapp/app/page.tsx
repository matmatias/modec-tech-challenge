"use client";

import { getuid } from "@/libs/frontend";
import {
  SelectOption,
  type EmployeeFilter,
  SelectOptionsValuesEnum,
  SelectOptionsLabelsEnum,
  Employee,
} from "@/model";
import { FetchEmployeesService } from "@/services";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { filterSelectOptions } from "./data";

export default function Home() {
  const [employeeFilter, setEmployeeFilter] = useState<EmployeeFilter>({
    first_name: "",
    last_name: "",
    department: "",
    age: "",
  });
  const [filtersUids, setFiltersUids] = useState<string[]>([getuid()]);
  const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filtersQty = filtersUids.length;

  return (
    <Fragment>
      <header
        style={{ borderBottom: "2px solid #ff0000" }}
        className="flex flex-row items-center justify-between p-4 bg-neutral-100"
      >
        <img src="/modec_logo.png" alt="modec logo" width={150} height={35} />
        <h1
          style={{ fontFamily: "Bank Gothic" }}
          className="flex flex-row text-4xl text-gray-500"
        >
          Employee Search
        </h1>
        <div>Welcome, Fulano!</div>
      </header>
      <main className="px-3 border-solid border-black pb-8">
        <section className="flex flex-col gap-2 mt-8">
          <h2 className="text-lg font-normal primary-text">Select Filters:</h2>
          <div className="flex flex-col">
            {filtersUids.map((uid: string, index: number) => {
              return (
                <div className="flex flex-row gap-14 items-center" key={uid}>
                  <Filter
                    employeeFilter={employeeFilter}
                    setEmployeeFilter={setEmployeeFilter}
                    selectOptions={filterSelectOptions}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />
                  {isLastFilter(index, filtersQty) && (
                    <div className="flex flex-row items-center gap-1">
                      <button
                        disabled={isFiltersQtyMax(filtersQty)}
                        onClick={() =>
                          setFiltersUids((prev) => [...prev, getuid()])
                        }
                      >
                        <img
                          src="/plus-button.png"
                          alt="Remove"
                          width={22}
                          height={22}
                        />
                      </button>
                      <button
                        disabled={isFiltersQtyMin(filtersQty)}
                        onClick={() =>
                          setFiltersUids((prev) => prev.slice(0, -1))
                        }
                      >
                        <img
                          src="/minus-button.png"
                          alt="Remove"
                          width={22}
                          height={22}
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row gap-5 mt-6">
            <button
              className="default-btn"
              onClick={async () => {
                setIsLoading(true);
                const fetchEmployeesService = new FetchEmployeesService();
                const employees =
                  await fetchEmployeesService.byFilter(employeeFilter);
                setEmployees(employees);
                setIsLoading(false);
              }}
            >
              Search
            </button>
            <button
              className="default-btn"
              onClick={() => {
                setFiltersUids((prev) => {
                  prev.splice(0);
                  prev.push(getuid());
                  return [...prev];
                });
                setEmployees([]);
              }}
            >
              Clear
            </button>
          </div>
        </section>
        {isLoading && (
          <div className="mt-4 flex flex-row justify-center">
            <div className="spinner"></div>
          </div>
        )}
        {employees.length > 0 && (
          <section className="mt-4 flex flex-col">
            <h2>Search Result:</h2>
            <EmployeesList employees={employees} />
          </section>
        )}
      </main>
      <footer
        style={{ borderTop: "1px solid rgb(200, 200, 200)" }}
        className="px-3 mt-10 pt-10 pb-6 flex flex-col primary-text gap-4"
      >
        <span>© 2019 - MODEC</span>
        <div className="flex flex-col items-center">
          <span>Made by Matheus Matias @ 2023</span>
          <ul className="flex flex-row justify-center gap-2">
            <li>
              <a
                className="underline text-black"
                href="https://github.com/matmatias"
                target="_blank"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                className="underline text-black"
                href="https://linkedin.com/in/matheus-matias-9a2a6519a"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </Fragment>
  );
}

interface FilterProps {
  employeeFilter: EmployeeFilter;
  setEmployeeFilter: Dispatch<SetStateAction<EmployeeFilter>>;
  selectedOptions: SelectOption[];
  setSelectedOptions: Dispatch<SetStateAction<SelectOption[]>>;
  selectOptions: SelectOption[];
}

function Filter({
  employeeFilter,
  setEmployeeFilter,
  selectedOptions,
  setSelectedOptions,
  selectOptions,
}: FilterProps) {
  const [selected, setSelected] = useState<SelectOptionsValuesEnum>(
    SelectOptionsValuesEnum.Default,
  );
  const selectedRef = useRef<keyof EmployeeFilter | "" | undefined>();

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    return () => {
      if (selectedRef.current !== "" && selectedRef.current) {
        /* remove selected option from selectedOptions */
        setSelectedOptions((prev) => {
          return [
            ...prev.filter((option) => {
              return option.value !== selectedRef.current;
            }),
          ];
        });
        resetFilterProp(selectedRef.current, setEmployeeFilter);
      }
    };
  }, []);

  return (
    <Fragment>
      <div className="flex flex-row gap-4">
        <select
          className="w-64"
          value={selected}
          onChange={(evt) => {
            if (selected !== "") {
              resetFilterProp(selected, setEmployeeFilter);
            }
            setSelectedOptions((prev) => {
              const selectedOption =
                evt.target.options[evt.target.selectedIndex];
              const label =
                selectedOption.textContent || selectedOption.innerText;
              const value = evt.target.value;
              return [
                /* remove the old selected option from selectedOptions */
                ...prev.filter((option) => {
                  return option.value !== selected;
                }),
                /* add the new selected to selectedOptions */
                {
                  label: label as SelectOptionsLabelsEnum,
                  value: value as SelectOptionsValuesEnum,
                },
              ];
            });
            setSelected(evt.target.value as SelectOptionsValuesEnum);
          }}
        >
          {selectOptions.map((selectOption) =>
            selectOption.value === SelectOptionsValuesEnum.Default ? (
              <option
                defaultValue={SelectOptionsValuesEnum.Default}
                disabled
                value={SelectOptionsValuesEnum.Default}
                key={selectOption.value}
              >
                {selectOption.label}
              </option>
            ) : (
              <option
                value={selectOption.value}
                disabled={
                  /* check if this option is present in selectedOptions */
                  isSelectOptionSelected(selectOption, selectedOptions)
                }
                key={selectOption.value}
              >
                {selectOption.label}
              </option>
            ),
          )}
        </select>
        {selected !== SelectOptionsValuesEnum.Default && (
          <input
            className="w-80"
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
      </div>
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
  const MAX_FILTERS_QTY = 4;
  return filtersQty < MAX_FILTERS_QTY ? false : true;
}

function isFiltersQtyMin(filtersQty: number): boolean {
  const MIN_FILTERS_QTY = 1;
  return filtersQty > MIN_FILTERS_QTY ? false : true;
}

function isLastFilter(index: number, filtersQty: number): boolean {
  return index === filtersQty - 1 ? true : false;
}

function isSelectOptionSelected(
  selectOption: SelectOption,
  selectedOptions: SelectOption[],
): boolean {
  return selectedOptions.some(
    (selectedOption) => selectedOption.value === selectOption.value,
  );
}

interface EmployeesListProps {
  employees: Employee[];
}

function EmployeesList({ employees }: EmployeesListProps) {
  return (
    <table className="w-full default-table">
      <thead>
        <tr>
          <th className="default-th">ID</th>
          <th className="default-th">First Name</th>
          <th className="default-th">Last Name</th>
          <th className="default-th">Department</th>
          <th className="default-th">Age</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td className="default-td">{employee.id}</td>
            <td className="default-td">{employee.first_name}</td>
            <td className="default-td">{employee.last_name}</td>
            <td className="default-td">{employee.department}</td>
            <td className="default-td">{employee.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
