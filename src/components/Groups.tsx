"use client";

import { useMenuFormFields } from "@/lib/form";
import { GroupItem, Menu } from "@/type";
import {
  Active,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Item } from "./Item";
import { Button } from "./ui/button";

type GroupsProps = {
  groupIndex: number;
  removeGroup: (index: number) => void;
};

export const Groups = ({ groupIndex, removeGroup }: GroupsProps) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const { control } = useFormContext<Menu>();
  const { fields, addNewItem, removeItem, moveItem } = useMenuFormFields(
    `menu.${groupIndex}.groups`
  );

  const groups = useWatch({
    control,
    name: `menu.${groupIndex}.groups`,
  } as never) as GroupItem[];

  const isAnyGroupDone = groups.some((group) => group.state === "done");

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    console.log({ active, over });
    if (over && active.id !== over.id) {
      const activeIndex = fields.findIndex(({ id }) => id === active.id);
      const overIndex = fields.findIndex(({ id }) => id === over.id);

      console.log({ activeIndex, overIndex });

      if (activeIndex !== -1 && overIndex !== -1) {
        moveItem(activeIndex, overIndex);
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col border rounded-md overflow-hidden bg-secondary">
        <SortableContext items={fields.map((field) => field.id)}>
          {fields.length
            ? fields.map((group, index) => (
                <Item
                  id={group.id}
                  key={group.id}
                  itemIndex={index}
                  groupIndex={groupIndex}
                  prefix={`menu.${groupIndex}.groups.${index}`}
                  removeGroup={removeGroup}
                  removeItem={removeItem}
                  depth={0}
                />
              ))
            : null}
        </SortableContext>

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
