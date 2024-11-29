"use client";

import { Empty } from "@/components/Empty";
import { Groups } from "@/components/Group";
import { Button } from "@/components/ui/button";
import { InitialItemState, Menu } from "@/type";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";

export default function Home() {
  const methods = useForm<Menu>({
    defaultValues: {
      menu: [],
    },
  });

  console.log("✅", methods.watch());

  return (
    <FormProvider {...methods}>
      <MenuGroups />
    </FormProvider>
  );
}

const MenuGroups = () => {
  const { control } = useFormContext<Menu>();
  const { fields, append } = useFieldArray({ control, name: "menu" });

  const addNewGroup = () => {
    append({ groups: [InitialItemState] });
  };

  console.log(fields);

  return (
    <div>
      {fields.length === 0 && <Empty addNewGroup={addNewGroup} />}
      {fields.map((field, index) => (
        <Groups key={field.id} index={index} />
      ))}
      {fields.length > 0 && (
        <div className='flex justify-center items-center mt-6'>
          <Button onClick={addNewGroup}>Dodaj pozycję menu</Button>
        </div>
      )}
    </div>
  );
};
