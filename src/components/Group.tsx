"use client";

import { InitialItemState, Menu } from "@/type";
import {
  useFieldArray,
  UseFieldArrayRemove,
  useFormContext,
} from "react-hook-form";
import { Item } from "./Item";
import { Button } from "./ui/button";

type GroupProps = {
  groupIndex: number;
  removeGroup: UseFieldArrayRemove;
};

export const Group = ({ groupIndex, removeGroup }: GroupProps) => {
  const { control } = useFormContext<Menu>();

  const {
    fields: items,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `groups.${groupIndex}`,
  });

  const addItem = () => {
    appendItem?.({ ...InitialItemState, name: "test" });
  };

  return (
    <div className="border rounded-md">
      {items.map((item, itemIndex) => (
        <Item
          key={item.id}
          groupIndex={groupIndex}
          itemIndex={itemIndex}
          append={appendItem}
          removeItem={removeItem}
          removeGroup={removeGroup}
        />
      ))}
      <div className="bg-transparent px-6 py-4">
        <Button variant="secondary" onClick={addItem}>
          Dodaj pozycję menu
        </Button>
      </div>
    </div>
  );
};
