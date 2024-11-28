import { InitialItemState, Menu } from "@/type";
import { useFieldArray, useFormContext } from "react-hook-form";

export const useMenuFormFields = (prefix: string) => {
  const { control, register } = useFormContext<Menu>();

  const groupsPath = `${prefix}.groups` as "groups";

  const { fields, append, remove } = useFieldArray({
    control,
    name: groupsPath,
  });

  const addNewGroup = () => {
    append([InitialItemState]);
  };

  const removeGroup = (groupIndex: number) => () => {
    remove(groupIndex);
  };

  return {
    fields,
    register,
    addNewGroup,
    removeGroup,
  };
};
