"use client";

import { Menu } from "@/type";
import { useFieldArray, useFormContext } from "react-hook-form";

export const useMenuFormFields = (prefix: string) => {
  const { control, register } = useFormContext<Menu>();

  const groupsPath = prefix;

  const { fields, append, remove } = useFieldArray({
    control,
    name: groupsPath,
  } as never);

  const addNewItem = () => {
    append({ name: "", link: "", state: "edit", groups: [] });
  };

  const removeItem = (index: number) => {
    remove(index);
  };

  return {
    fields,
    register,
    addNewItem,
    removeItem,
  };
};
