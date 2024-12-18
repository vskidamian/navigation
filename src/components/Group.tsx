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
  const [activeId, setActiveId] = useState<Active | null>(null);

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
    if (over && active.id !== over.id) {
      const activeIndex = fields.findIndex(({ id }) => id === active.id);
      const overIndex = fields.findIndex(({ id }) => id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        moveItem(activeIndex, overIndex);
      }
    }
    setActiveId(null);
  };

  const activeItem = useMemo(() => {
    const item = fields.find((item) => item.id === activeId?.id);
    if (!item) return null;

    return {
      ...item,
      index: fields.indexOf(item),
    };
  }, [activeId, fields]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        console.log({ active });
        setActiveId(active);
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActiveId(null);
      }}
    >
      <div className="flex flex-col border rounded-md overflow-hidden bg-secondary">
        <SortableContext items={fields.map((field) => field.id)}>
          {fields.length
            ? fields.map((group, index) => (
                <Group
                  id={group.id}
                  key={group.id}
                  index={index}
                  groupIndex={groupIndex}
                  prefix={`menu.${groupIndex}.groups.${index}`}
                  removeGroup={removeGroup}
                  removeItem={removeItem}
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

type GroupProps = {
  id: string;
  index: number;
  groupIndex: number;
  prefix: string;
  removeGroup: (index: number) => void;
  removeItem: (index: number) => void;
};

export const Group = ({
  id,
  index,
  groupIndex,
  prefix,
  removeGroup,
  removeItem,
}: GroupProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="rounded-md">
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
