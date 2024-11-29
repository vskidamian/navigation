"use client";

import { useMenuFormFields } from "@/lib/form";
import { Item } from "./Item";
import { Button } from "./ui/button";

type GroupsProps = {
  prefix?: string;
  index: number;
};

export const Groups = ({ prefix = "", index }: GroupsProps) => {
  // const { fields } = useMenuFormFields(prefix);

  return (
    <p>{index}</p>
    // <>
    //   {fields.length ? (
    //     <div className='flex flex-col space-y-8'>
    //       {fields.map((group, groupIndex) => (
    //         <p key={group.id}>{groupIndex}</p>
    //         // <Group
    //         //   key={group.id}
    //         //   groupIndex={groupIndex}
    //         //   prefix={`${prefix}groups.${groupIndex}.`}
    //         //   depth={0}
    //         // />
    //       ))}
    //     </div>
    //   ) : null}
    // </>
  );
};

type GroupProps = {
  groupIndex: number;
  prefix: string;
  depth: number;
};

export const Group = ({ groupIndex, prefix, depth }: GroupProps) => {
  const { fields, addNewGroup, removeGroup } = useMenuFormFields(prefix);

  console.log(`Group-${groupIndex}`, { fields, prefix });

  return (
    <div className='border rounded-md'>
      <Item
        index={groupIndex}
        addNewGroup={addNewGroup}
        removeGroup={removeGroup}
        prefix={prefix}
        depth={depth}
      />
      <div>
        {fields.map((item, itemIndex) => (
          <Item
            key={item.id}
            index={itemIndex}
            addNewGroup={addNewGroup}
            removeGroup={removeGroup}
            prefix={`${prefix}groups.${itemIndex}.`}
            test={true}
            depth={depth}
          />
        ))}
      </div>
      <div className='bg-transparent px-6 py-4'>
        <Button variant='secondary' onClick={addNewGroup}>
          Dodaj pozycję menu
        </Button>
      </div>
    </div>
  );
};
