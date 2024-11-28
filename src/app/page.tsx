"use client";

import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Empty } from "@/components/Empty";
import { Menu } from "@/type";
import { Group } from "@/components/Group";

export default function Home() {
  const methods = useForm<Menu>({
    defaultValues: {
      groups: [],
    },
  });

  return (
    <FormProvider {...methods}>
      <Groups />
    </FormProvider>
  );
}

export const Groups = () => {
  const { control, getValues } = useFormContext<Menu>();

  const {
    fields: groups,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "groups",
  });

  console.log("Groups", getValues());

  return (
    <div>
      <Empty append={append} />
      <div className="flex flex-col space-y-8">
        {groups.map((group, groupIndex) => (
          <Group key={group.id} groupIndex={groupIndex} removeGroup={remove} />
        ))}
      </div>
    </div>
  );
};
