"use client";

import { Menu } from "@/type";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useRef } from "react";

export const useMenuFormFields = (prefix: string) => {
  const { control, register } = useFormContext<Menu>();
  const initialized = useRef(false);

  const groupsPath = prefix;

  const { fields, append, remove } = useFieldArray({
    control,
    name: groupsPath,
  } as never);

  const addNewItem = () => {
    console.log("fields", { fields, groupsPath });
    append({ name: "", link: "", state: "edit", groups: [] });
  };

  const removeItem = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (fields.length === 0) {
        append({ name: "", link: "", state: "edit", groups: [] });
      }
    }
  }, [append, fields]); // You can still include dependencies for clarity

  return {
    fields,
    register,
    addNewItem,
    removeItem,
  };
};
