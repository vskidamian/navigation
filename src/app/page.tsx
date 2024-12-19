"use client";

import { Empty } from "@/components/Empty";
import { Groups } from "@/components/Groups";
import { HelperButtons } from "@/components/HelperButtons";
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

  return (
    <FormProvider {...methods}>
      <MenuGroups />
    </FormProvider>
  );
}

const MenuGroups = () => {
  const { control } = useFormContext<Menu>();
  const { fields, append, remove } = useFieldArray({ control, name: "menu" });

  const addNewGroup = () => {
    append({ groups: [{ ...InitialItemState }] });
  };

  const removeGroup = (index: number) => {
    remove(index);
  };

  const areFieldsEmpty = fields.length === 0;

  return (
    <div>
      <HelperButtons />
      {areFieldsEmpty && <Empty addNewGroup={addNewGroup} />}
      <div id="menu-groups" className="flex flex-col space-y-8">
        {fields.map((field, groupIndex) => (
          <Groups
            key={field.id}
            groupIndex={groupIndex}
            removeGroup={() => removeGroup(groupIndex)}
          />
        ))}
      </div>

      {!areFieldsEmpty && (
        <div className="flex justify-center items-center mt-6">
          <Button onClick={addNewGroup}>Dodaj nową grupę</Button>
        </div>
      )}
    </div>
  );
};
