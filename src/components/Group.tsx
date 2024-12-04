"use client";

import { useMenuFormFields } from "@/lib/form";
import { Menu, GroupItem } from "@/type";
import { useFormContext, useWatch } from "react-hook-form";
import { Item } from "./Item";
import { Button } from "./ui/button";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { Move } from "lucide-react";

type GroupsProps = {
  groupIndex: number;
  removeGroup: (index: number) => void;
};

export const Groups = ({ groupIndex, removeGroup }: GroupsProps) => {
  const { setNodeRef } = useDroppable({
    id: `group-${groupIndex}`,
  });

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
    <DndContext>
      <div className="flex flex-col border rounded-md overflow-hidden">
        <div ref={setNodeRef}>
          {fields.length
            ? fields.map((group, index) => (
                <Group
                  key={group.id}
                  index={index}
                  groupIndex={groupIndex}
                  prefix={`menu.${groupIndex}.groups.${index}`}
                  removeGroup={removeGroup}
                  removeItem={removeItem}
                />
              ))
            : null}
        </div>
        {isAnyGroupDone && (
          <div className="bg-transparent px-6 py-4">
            <Button variant="secondary" onClick={addNewItem}>
              Dodaj pozycję menu
            </Button>
          </div>
        )}
      </div>
    </DndContext>
  );
};

type GroupProps = {
  index: number;
  groupIndex: number;
  prefix: string;
  removeGroup: (index: number) => void;
  removeItem: (index: number) => void;
};

export const Group = ({
  index,
  groupIndex,
  prefix,
  removeGroup,
  removeItem,
}: GroupProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `group-${index}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-secondary rounded-md"
    >
      <Item
        groupIndex={groupIndex}
        itemIndex={index}
        listeners={listeners}
        removeGroup={removeGroup}
        removeItem={removeItem}
        prefix={prefix}
        depth={0}
      />
    </div>
  );
};
