"use client";

import { InitialItemState, Menu } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
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
import Image from "next/image";
import { DeleteIcon } from "./icons/DeleteIcon";
import { ChevronRight } from "lucide-react";

const itemFormSchema = z.object({
  name: z.string().min(1, {
    message: "Brak nazwy",
  }),
  link: z.string(),
});

type ItemProps = {
  groupIndex: number;
  itemIndex: number;
  append?: UseFieldArrayAppend<Menu, `groups.${number}`>;
  removeItem?: UseFieldArrayRemove;
  removeGroup?: UseFieldArrayRemove;
};

export const Item = ({
  groupIndex,
  itemIndex,
  append,
  removeItem,
  removeGroup,
}: ItemProps) => {
  const { control, getValues } = useFormContext<Menu>();

  const item = useWatch({ control, name: `groups.${groupIndex}.${itemIndex}` });

  const handleRemoveItem = () => {
    removeItem?.(itemIndex);

    if (getValues().groups[groupIndex].length === 0) removeGroup?.(groupIndex);
  };

  return (
    <div>
      {item.state === "edit" ? (
        <div className="px-6 py-4 bg-secondary">
          <ItemForm
            groupIndex={groupIndex}
            itemIndex={itemIndex}
            handleRemoveItem={handleRemoveItem}
          />
        </div>
      ) : (
        <ItemDone
          groupIndex={groupIndex}
          itemIndex={itemIndex}
          append={append}
          handleRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
};

type ItemFormProps = ItemProps & {
  handleRemoveItem: () => void;
};
export const ItemForm = ({
  groupIndex,
  itemIndex,
  handleRemoveItem,
}: ItemFormProps) => {
  const { control, setValue } = useFormContext<Menu>();

  const item = useWatch({
    control,
    name: `groups.${groupIndex}.${itemIndex}`,
  });

  const onSubmit = (values: z.infer<typeof itemFormSchema>) => {
    setValue(`groups.${groupIndex}.${itemIndex}`, {
      ...InitialItemState,
      ...values,
      state: "done",
    });
  };

  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema, {}),
    defaultValues: item && item.name ? item : InitialItemState,
  });

  const cancelHandler = () => {
    const isAdded = item && item.name !== "";

    if (isAdded) {
      setValue(`groups.${groupIndex}.${itemIndex}`, {
        ...item,
        state: "done",
      });

      return;
    }

    form.reset(InitialItemState);
  };

  return (
    <div className="px-6 py-5 flex flex-col bg-white border-border border-[1px] rounded-md relative">
      <Button
        variant="ghost"
        className="absolute h-10 w-10 p-0 top-5 right-8"
        onClick={handleRemoveItem}
      >
        <DeleteIcon />
      </Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-2 pb-5 pr-20 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa</FormLabel>
                  <FormControl>
                    <Input placeholder="np. Promocje" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Wklej lub wyszukaj" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2 ">
            <Button type="button" variant="outline" onClick={cancelHandler}>
              Anuluj
            </Button>
            <Button type="submit">Dodaj</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

type ItemDoneProps = ItemProps & {
  handleRemoveItem: () => void;
};

export const ItemDone = ({
  groupIndex,
  itemIndex,
  handleRemoveItem,
}: ItemDoneProps) => {
  const { control, setValue } = useFormContext<Menu>();

  const item = useWatch({
    control,
    name: `groups.${groupIndex}.${itemIndex}`,
  });

  const handleEditItem = () => {
    setValue(`groups.${groupIndex}.${itemIndex}`, {
      ...item,
      state: "edit",
    });
  };

  const handleAddItem = () => {};

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-tl-md rounded-tr-md border-b">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm ">{item.link}</p>
      </div>

      <div className="flex items-center border rounded-md">
        <Button variant="secondary" onClick={handleRemoveItem}>
          Usuń
        </Button>
        <span className="h-9 w-px bg-border" aria-hidden="true" />
        <Button variant="secondary" onClick={handleEditItem}>
          Edytuj
        </Button>
        <span className="h-9 w-px bg-border" aria-hidden="true" />
        <Button variant="secondary" onClick={handleAddItem}>
          Dodaj pozycję menu
        </Button>
      </div>
    </div>
  );
};
