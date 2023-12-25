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
            {filtersUids.map((uid: string, index: number) => {
              return (
                <div className="flex flex-row" key={uid}>
                  <Filter
                    employeeFilter={employeeFilter}
                    setEmployeeFilter={setEmployeeFilter}
                    selectOptions={filterSelectOptions}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                  />
                  {isLastFilter(index, filtersQty) && (
                    <div>
                      <button
                        disabled={isFiltersQtyMax(filtersQty)}
                        onClick={() =>
                          setFiltersUids((prev) => [...prev, getuid()])
                        }
                      >
                        +
                      </button>
                      <button
                        disabled={isFiltersQtyMin(filtersQty)}
                        onClick={() =>
                          setFiltersUids((prev) => prev.slice(0, -1))
                        }
                      >
                        -
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-row">
            <button
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
              onClick={() =>
                setFiltersUids((prev) => {
                  prev.splice(1);
                  return [...prev];
                })
              }
            >
              Clear
            </button>
          </div>
        </div>
        {isLoading && <h3>..............LOADING..............</h3>}
        {employees.length > 0 && (
          <section>
            <EmployeesList employees={employees} />
          </section>
        )}
      </main>
      <footer>2019 - MODEC</footer>
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
      <select
        value={selected}
        onChange={(evt) => {
          if (selected !== "") {
            resetFilterProp(selected, setEmployeeFilter);
          }
          setSelectedOptions((prev) => {
            const selectedOption = evt.target.options[evt.target.selectedIndex];
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
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Department</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.first_name}</td>
            <td>{employee.last_name}</td>
            <td>{employee.department}</td>
            <td>{employee.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
