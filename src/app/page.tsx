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
  const { control, getValues } = useFormContext<Menu>();
  const { fields, append, remove } = useFieldArray({ control, name: "menu" });

  const addNewGroup = () => {
    append({ groups: [{ ...InitialItemState }] });
  };

  const removeGroup = (index: number) => {
    console.log("remove", index);
    remove(index);
  };

  return (
    <div>
      <Button
        className="mb-8"
        onClick={() => console.log("✅GET VALUES", getValues())}
      >
        GET VALUES
      </Button>
      {fields.length === 0 && <Empty addNewGroup={addNewGroup} />}
      <div id="menu-groups" className="flex flex-col space-y-8">
        {fields.map((field, groupIndex) => (
          <Groups
            key={field.id}
            groupIndex={groupIndex}
            removeGroup={() => removeGroup(groupIndex)}
          />
        ))}
      </div>

      {fields.length > 0 && (
        <div className="flex justify-center items-center mt-6">
          <Button onClick={addNewGroup}>Dodaj grupę</Button>
        </div>
      )}
    </div>
  );
};
