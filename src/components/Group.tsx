"use client";

import { useMenuFormFields } from "@/lib/form";
import { Empty } from "./Empty";
import { Item } from "./Item";
import { Button } from "./ui/button";

type GroupsProps = {
  prefix?: string;
};

export const Groups = ({ prefix = "" }: GroupsProps) => {
  const { fields, addNewGroup } = useMenuFormFields(prefix);

  console.log("fields", fields, prefix);

  return (
    <>
      {fields.length === 0 && !prefix && <Empty addNewGroup={addNewGroup} />}
      {fields.length ? (
        <div className="flex flex-col space-y-8">
          {fields.map((group, groupIndex) => (
            <Group
              key={group.id}
              groupIndex={groupIndex}
              prefix={`${prefix}groups.${groupIndex}.`}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};

type GroupProps = {
  groupIndex: number;
  prefix: string;
};

export const Group = ({ groupIndex, prefix }: GroupProps) => {
  const { fields, addNewGroup, removeGroup } = useMenuFormFields(prefix);

  console.log("fields in group", fields);

  return (
    <div className="border rounded-md">
      <Item
        groupIndex={groupIndex}
        addNewGroup={addNewGroup}
        removeGroup={removeGroup}
        prefix={prefix}
      />
      {fields.map((item, itemIndex) => (
        <Item
          key={item.id}
          groupIndex={itemIndex}
          addNewGroup={addNewGroup}
          removeGroup={removeGroup}
          prefix={prefix}
        />
      ))}
      <div className="bg-transparent px-6 py-4">
        <Button variant="secondary" onClick={addNewGroup}>
          Dodaj pozycję menu
        </Button>
      </div>
    </div>
  );
};
