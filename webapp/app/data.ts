import {
  SelectOption,
  SelectOptionsLabelsEnum,
  SelectOptionsValuesEnum,
} from "@/model";

export const filterSelectOptions: SelectOption[] = [
  {
    label: SelectOptionsLabelsEnum.Default,
    value: SelectOptionsValuesEnum.Default,
  },
  {
    label: SelectOptionsLabelsEnum.FirstName,
    value: SelectOptionsValuesEnum.FirstName,
  },
  {
    label: SelectOptionsLabelsEnum.LastName,
    value: SelectOptionsValuesEnum.LastName,
  },
  {
    label: SelectOptionsLabelsEnum.Department,
    value: SelectOptionsValuesEnum.Department,
  },
  { label: SelectOptionsLabelsEnum.Age, value: SelectOptionsValuesEnum.Age },
];
