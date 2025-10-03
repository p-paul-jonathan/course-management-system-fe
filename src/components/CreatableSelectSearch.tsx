import { ActionMeta, MultiValue, PropsValue } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";

import FormInputLabel from "./FormInputLabel";

interface CreatableSelectSearchProps {
  name: string;
  labelName: string;
  required?: boolean;
  value: PropsValue<{ value: string; label: string; }>;
  promiseOptions: (inputValue: string) => Promise<{ value: string, label: string }[]>;
  onChange: (
    newValue: MultiValue<{ value: string; label: string; }>,
    actionMeta: ActionMeta<{ value: string; label: string; }>
  ) => void;
  handleCreate: (inputValue: string) => void;
}

function CreatableSelectSearch({
  name,
  labelName,
  required = false,
  value,
  promiseOptions,
  onChange,
  handleCreate
}: CreatableSelectSearchProps) {
  return (
    <>
      <FormInputLabel name={name} labelName={labelName} required={required} />
      <AsyncCreatableSelect
        unstyled
        loadOptions={promiseOptions}
        isMulti
        onChange={onChange}
        value={value}
        onCreateOption={handleCreate}
        required={required}
        classNames={{
          control: ({ isFocused }) =>
            `border rounded-md p-1 transition-colors
             ${isFocused ? "border-blue-500 ring-2 ring-blue-400" : "border-gray-300 dark:border-gray-600"}
             bg-white dark:bg-gray-800
             text-gray-900 dark:text-gray-100`,
          menu: () =>
            "mt-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-lg",
          option: ({ isFocused, isSelected }) =>
            `px-3 py-2 cursor-pointer
             ${isSelected ? "bg-blue-500 text-white" : isFocused ? "bg-gray-200 dark:bg-gray-700" : "bg-transparent"}
             text-gray-900 dark:text-gray-100`,
          multiValue: () =>
            "flex items-center gap-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded px-2 py-1",
          multiValueLabel: () =>
            "text-xs",
          multiValueRemove: () =>
            "cursor-pointer hover:text-red-500",
          noOptionsMessage: () =>
            "px-4 py-4 text-gray-400 text-sm"
        }}
      />
    </>
  )
}

export default CreatableSelectSearch;
