"use client";

import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Empty } from "@/components/Empty";
import { MenuForm } from "@/type";
import { MenuItem } from "@/components/MenuItem";

export default function Home() {
  const methods = useForm<MenuForm>({
    defaultValues: {
      menuItems: [],
    },
  });

  return (
    <FormProvider {...methods}>
      <MenuItems />
    </FormProvider>
  );
}

export const MenuItems = () => {
  const { control, getValues } = useFormContext<MenuForm>();

  const { fields: menuItems, append } = useFieldArray({
    control,
    name: "menuItems",
  });

  console.log(getValues());

  return (
    <>
      <Empty append={append} />
      {menuItems.map((item, index) => (
        <MenuItem key={item.id} index={index} />
      ))}
    </>
  );
};
