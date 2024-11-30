"use client";

import { useMenuFormFields } from "@/lib/form";
import { Menu, TItem } from "@/type";
import { useFormContext, useWatch } from "react-hook-form";
import { Item } from "./Item";
import { Button } from "./ui/button";

type GroupsProps = {
  prefix?: string;
  index: number;
  removeGroup: (index: number) => void;
};

export const Groups = ({ prefix = "", index, removeGroup }: GroupsProps) => {
  const { fields } = useMenuFormFields(`menu.${prefix}${index}.groups`);

  console.log("first", fields);
  return (
    <>
      {fields.length ? (
        <div className='flex flex-col space-y-8'>
          {fields.map((group, groupIndex) => (
            <Group
              key={group.id}
              groupIndex={groupIndex}
              prefix={`menu.${prefix}${index}.groups.${groupIndex}`}
              depth={0}
              removeGroup={removeGroup}
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
  depth: number;
  removeGroup: (index: number) => void;
};

export const Group = ({
  groupIndex,
  prefix,
  depth,
  removeGroup,
}: GroupProps) => {
  const { control } = useFormContext<Menu>();
  const { fields, removeItem, addNewItem } = useMenuFormFields(prefix);

  const group = useWatch({
    control,
    name: prefix,
  } as never) as TItem;

  console.log(fields);

  return (
    <div className='border rounded-md'>
      <div>
        {fields.map((item, itemIndex) => (
          <Item
            key={item.id}
            groupIndex={groupIndex}
            itemIndex={itemIndex}
            removeGroup={removeGroup}
            removeItem={removeItem}
            prefix={`${prefix}.${itemIndex}`}
            test={true}
            depth={depth}
          />
        ))}
      </div>

      {group.state === "done" && (
        <div className='bg-transparent px-6 py-4'>
          <Button variant='secondary' onClick={addNewItem}>
            Dodaj pozycję menu
          </Button>
        </div>
      )}
    </div>
  );
};
