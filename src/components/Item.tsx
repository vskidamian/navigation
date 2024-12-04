"use client";

import { useMenuFormFields } from "@/lib/form";
import { InitialItemState, Menu, GroupItem } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, useWatch } from "react-hook-form";
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
import { group } from "console";
import { Move } from "lucide-react";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const itemFormSchema = z.object({
  name: z.string().min(1, {
    message: "Brak nazwy",
  }),
  link: z.string(),
});

type ItemProps = {
  groupIndex: number;
  itemIndex: number;
  removeGroup: (index: number) => void;
  removeItem: (index: number) => void;
  prefix: string;
  depth: number;
  listeners?: SyntheticListenerMap;
};

export const Item = ({
  itemIndex,
  groupIndex,
  removeItem,
  removeGroup,
  listeners,
  prefix,
  depth,
}: ItemProps) => {
  const { control, setValue, getValues } = useFormContext<Menu>();
  const {
    fields,
    removeItem: removeItemToPass,
    addNewItem,
  } = useMenuFormFields(`${prefix}.groups`);

  const item = useWatch({
    control,
    name: prefix,
  } as never) as GroupItem;

  const onSubmit = (values: z.infer<typeof itemFormSchema>) => {
    //@ts-expect-error TODO: fix
    setValue(prefix as unknown, {
      ...InitialItemState,
      ...values,
      state: "done",
      groups: item.groups,
    });
  };

  const form = useForm<z.infer<typeof itemFormSchema>>({
    resolver: zodResolver(itemFormSchema, {}),
    defaultValues: item && item.name ? item : InitialItemState,
  });

  const cancelHandler = () => {
    const isAdded = item && item.name !== "";

    if (isAdded) {
      //@ts-expect-error TODO: fix
      setValue(prefix as unknown, {
        ...item,
        state: "done",
      });

      return;
    }

    form.reset(InitialItemState);
  };

  const handleEditItem = () => {
    //@ts-expect-error TODO: fix
    setValue(prefix as unknown, {
      ...item,
      state: "edit",
    });
  };

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

  return (
    <div id="item" style={{ paddingLeft: depth > 0 ? `64px` : "0" }}>
      {item.state === "edit" ? (
        <div
          style={{
            ...(depth === 0 && { padding: "1.25rem 1.5rem 1.25rem 1.5rem" }),
          }}
          className="pr-6 py-4 bg-secondary"
        >
          <div className="px-6 py-5 flex flex-col bg-white shadow-border rounded-md relative">
            <Button
              variant="ghost"
              className="absolute h-10 w-10 p-0 top-5 right-8"
              onClick={() => removeGroup?.(groupIndex)}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelHandler}
                  >
                    Anuluj
                  </Button>
                  <Button type="submit">Dodaj</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <div className="flex p-5 bg-white shadow-border mb-[1px] ">
          <Button
            {...listeners}
            size="icon"
            variant="ghost"
            className="p-[10px] mr-1"
          >
            <Move className="h-5 w-5" />
          </Button>
          <div
            className="flex items-center justify-between w-full"
            style={{
              ...(item.groups?.length &&
                depth > 0 && {
                  borderBottomLeftRadius: "calc(var(--radius) - 2px)",
                }),
            }}
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-sm ">{item.link}</p>
            </div>

            <div className="flex items-center shadow-border rounded-md">
              <Button variant="secondary" onClick={handleRemove}>
                Usuń
              </Button>
              <span className="h-9 w-px bg-border" aria-hidden="true" />
              <Button variant="secondary" onClick={handleEditItem}>
                Edytuj
              </Button>
              <span className="h-9 w-px bg-border" aria-hidden="true" />
              <Button variant="secondary" onClick={addNewItem}>
                Dodaj pozycję menu
              </Button>
            </div>
          </div>
        </div>
      )}
      {fields.map((item, index) => (
        <Item
          key={item.id}
          itemIndex={index}
          groupIndex={itemIndex}
          prefix={`${prefix}.groups.${index}`}
          depth={depth + 1}
          removeGroup={removeGroup}
          removeItem={removeItemToPass}
        />
      ))}
    </div>
  );
};
