"use client";

import { useMenuFormFields } from "@/lib/form";
import { handleDragEnd } from "@/lib/utils";
import { GroupItem, InitialItemState, Menu } from "@/type";
import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragStartEvent,
  DropAnimation,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { Move } from "lucide-react";
import { useState } from "react";
import {
  FieldArrayWithId,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { DeleteIcon } from "./icons/DeleteIcon";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const itemFormSchema = z.object({
  name: z.string().min(1, {
    message: "Brak nazwy",
  }),
  link: z.string(),
});

type ItemProps = {
  id: string;
  groupIndex: number;
  itemIndex: number;
  removeGroup: (index: number) => void;
  removeItem: (index: number) => void;
  prefix: string;
  depth: number;
};

export const Item = ({
  id,
  itemIndex,
  groupIndex,
  removeItem,
  removeGroup,
  prefix,
  depth,
}: ItemProps) => {
  const { control, getValues } = useFormContext<Menu>();
  const {
    fields,
    removeItem: removeItemToPass,
    addNewItem,
    moveItem,
  } = useMenuFormFields(`${prefix}.groups`);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition,
        opacity: isDragging ? 0.65 : undefined,
      }
    : undefined;

  const item = useWatch({
    control,
    name: prefix as `menu.${number}.groups.${number}`,
  }) as GroupItem;

  const handleRemove = () => {
    if (depth === 0) {
      const menuGroups = getValues(`menu.${groupIndex}.groups`);

      if (menuGroups.length === 1) {
        removeGroup(groupIndex);
        return;
      }
    }

    removeItem(itemIndex);
  };

  const isEditState = item.state === "edit";

  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.4",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={({ active, over }) => {
        handleDragEnd({ active, over, fields, moveItem });
      }}
    >
      <div
        id='item'
        className='rounded-md'
        ref={setNodeRef}
        {...attributes}
        style={{
          ...style,
          paddingLeft: depth > 0 ? `64px` : "0",
          zIndex: 2,
        }}
      >
        {isEditState ? (
          <EditItem prefix={prefix} depth={depth} handleRemove={handleRemove} />
        ) : (
          <DoneItem
            addNewItem={addNewItem}
            depth={depth}
            prefix={prefix}
            handleRemove={handleRemove}
            listeners={listeners}
          />
        )}
        <SortableContext items={fields.map((field) => field.id)}>
          {fields.map((item, index) => (
            <Item
              id={item.id}
              key={item.id}
              itemIndex={index}
              groupIndex={itemIndex}
              prefix={`${prefix}.groups.${index}`}
              depth={depth + 1}
              removeGroup={removeGroup}
              removeItem={removeItemToPass}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

type EditItemProps = {
  depth: ItemProps["depth"];
  prefix: ItemProps["prefix"];
  handleRemove: () => void;
};

export const EditItem = ({ depth, prefix, handleRemove }: EditItemProps) => {
  const { control, setValue } = useFormContext<Menu>();

  const item = useWatch({
    control,
    name: prefix as `menu.${number}.groups.${number}`,
  }) as GroupItem;

  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema, {}),
    defaultValues: item && item.name ? item : InitialItemState,
  });

  const onSubmit = (values: z.infer<typeof itemFormSchema>) => {
    setValue(prefix as `menu.${number}.groups.${number}`, {
      ...InitialItemState,
      ...values,
      state: "done",
      groups: item.groups,
    });
  };

  const cancelHandler = () => {
    const isAdded = item && item.name !== "";

    if (isAdded) {
      setValue(prefix as `menu.${number}.groups.${number}`, {
        ...item,
        state: "done",
      });

      return;
    }

    form.reset(InitialItemState);
  };

  return (
    <div
      style={{
        ...(depth === 0 && { padding: "1.25rem 1.5rem 1.25rem 1.5rem" }),
      }}
      className='pr-6 py-4 bg-secondary'
    >
      <div className='px-6 py-5 flex flex-col bg-white shadow-border rounded-md relative'>
        <Button
          variant='ghost'
          className='absolute h-10 w-10 p-0 top-5 right-8'
          onClick={handleRemove}
        >
          <DeleteIcon />
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-2 pb-5 pr-20 '>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa</FormLabel>
                    <FormControl>
                      <Input placeholder='np. Promocje' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='link'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder='Wklej lub wyszukaj' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-row gap-2 '>
              <Button type='button' variant='outline' onClick={cancelHandler}>
                Anuluj
              </Button>
              <Button type='submit'>Dodaj</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

type DoneItemProps = EditItemProps & {
  addNewItem: () => void;
  listeners?: SyntheticListenerMap;
};

export const DoneItem = ({
  addNewItem,
  handleRemove,
  depth,
  prefix,
  listeners,
}: DoneItemProps) => {
  const { control, setValue } = useFormContext<Menu>();

  const item = useWatch({
    control,
    name: prefix as `menu.${number}.groups.${number}`,
  }) as GroupItem;

  const handleEditItem = () => {
    setValue(prefix as `menu.${number}.groups.${number}`, {
      ...item,
      state: "edit",
    });
  };

  return (
    <div className='flex p-5 bg-white shadow-border mb-[1px] h-20 z-10'>
      <Button
        {...listeners}
        size='icon'
        variant='ghost'
        className='p-[10px] mr-1'
      >
        <Move className='h-5 w-5' />
      </Button>
      <div
        className='flex items-center justify-between w-full'
        style={{
          ...(item.groups?.length &&
            depth > 0 && {
              borderBottomLeftRadius: "calc(var(--radius) - 2px)",
            }),
        }}
      >
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>{item.name}</h3>
          <p className='text-sm '>{item.link}</p>
        </div>

        <div className='flex items-center shadow-border rounded-md'>
          <Button variant='secondary' onClick={handleRemove}>
            Usuń
          </Button>
          <span className='h-9 w-px bg-border' aria-hidden='true' />
          <Button variant='secondary' onClick={handleEditItem}>
            Edytuj
          </Button>
          <span className='h-9 w-px bg-border' aria-hidden='true' />
          <Button variant='secondary' onClick={addNewItem}>
            Dodaj pozycję menu
          </Button>
        </div>
      </div>
    </div>
  );
};

type OverlayItemProps = {
  id: UniqueIdentifier;
  fields: FieldArrayWithId<Menu, "menu" | `menu.${number}.groups`, "id">[];
  depth: ItemProps["depth"];
};
export const OverlayItem = ({ id, fields, depth }: OverlayItemProps) => {
  const item = fields.find((field) => field.id === id) as GroupItem;

  if (!item) return null;

  return (
    <div
      className='flex p-5 bg-white shadow-border mb-[1px] h-20 opacity-70 overflow-hidden'
      style={{ transform: depth > 0 ? `translateX(64px)` : "translateX(0)" }}
    >
      <div className='flex items-center justify-between w-full'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>{item.name}</h3>
          <p className='text-sm '>{item.link}</p>
        </div>
      </div>
    </div>
  );
};
