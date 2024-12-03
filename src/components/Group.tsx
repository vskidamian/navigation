"use client";

import { useMenuFormFields } from "@/lib/form";
import { Menu, GroupItem } from "@/type";
import { useFormContext, useWatch } from "react-hook-form";
import { Item } from "./Item";
import { Button } from "./ui/button";

type GroupsProps = {
  groupIndex: number;
  removeGroup: (index: number) => void;
};

export const Groups = ({ groupIndex, removeGroup }: GroupsProps) => {
  const { control } = useFormContext<Menu>();
  const { fields, addNewItem, removeItem } = useMenuFormFields(
    `menu.${groupIndex}.groups`
  );

  const groups = useWatch({
    control,
    name: `menu.${groupIndex}.groups`,
  } as never) as GroupItem[];

  const isAnyGroupDone = groups.some((group) => group.state === "done");

  return (
    <div className="flex flex-col border rounded-md overflow-hidden">
      {fields.length
        ? fields.map((group, index) => (
            <Group
              key={group.id}
              itemIndex={index}
              groupIndex={groupIndex}
              prefix={`menu.${groupIndex}.groups.${index}`}
              removeGroup={removeGroup}
              removeItem={removeItem}
            />
          ))
        : null}
      {isAnyGroupDone && (
        <div className="bg-transparent px-6 py-4">
          <Button variant="secondary" onClick={addNewItem}>
            Dodaj pozycję menu
          </Button>
        </div>
      )}
    </div>
  );
};

type GroupProps = {
  itemIndex: number;
  groupIndex: number;
  prefix: string;
  removeGroup: (index: number) => void;
  removeItem: (index: number) => void;
};

export const Group = ({
  itemIndex,
  groupIndex,
  prefix,
  removeGroup,
  removeItem,
}: GroupProps) => {
  return (
    <div className="bg-secondary rounded-md">
      <Item
        groupIndex={groupIndex}
        itemIndex={itemIndex}
        removeGroup={removeGroup}
        removeItem={removeItem}
        prefix={prefix}
        depth={0}
      />
    </div>
  );
};
