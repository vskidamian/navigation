"use client";

import { Menu } from "@/type";
import { useFieldArray, useFormContext } from "react-hook-form";

export const useMenuFormFields = (prefix: string) => {
  const { control, register } = useFormContext<Menu>();

  const groupsPath = prefix as "menu" | `menu.${number}.groups`;

  const { fields, append, remove, replace, update, move } = useFieldArray({
    control,
    name: groupsPath,
  });

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
    replaceItem: replace,
    updateItem: update,
    moveItem: move,
  };
};
