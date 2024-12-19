"use client";

import { useMenuFormFields } from "@/lib/form";
import { handleDragEnd } from "@/lib/utils";
import { GroupItem, Menu } from "@/type";
import {
  DndContext,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useFormContext, useWatch } from "react-hook-form";
import { Item } from "./Item";
import { Button } from "./ui/button";
import { useState } from "react";

type GroupsProps = {
  groupIndex: number;
  removeGroup: (index: number) => void;
};

export const Groups = ({ groupIndex, removeGroup }: GroupsProps) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const { control } = useFormContext<Menu>();
  const { fields, addNewItem, removeItem, moveItem } = useMenuFormFields(
    `menu.${groupIndex}.groups`
  );

  const groups = useWatch({
    control,
    name: `menu.${groupIndex}.groups`,
  } as never) as GroupItem[];

  const isAnyGroupDone = groups.some((group) => group.state === "done");

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={({ active, over }) =>
        handleDragEnd({ active, over, fields, moveItem })
      }
    >
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
