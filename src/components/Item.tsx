"use client";

import { useMenuFormFields } from "@/lib/form";
import { InitialItemState, Menu, TItem } from "@/type";
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

const itemFormSchema = z.object({
  name: z.string().min(1, {
    message: "Brak nazwy",
  }),
  link: z.string(),
});

type ItemProps = {
  index: number;
  addNewGroup: () => void;
  removeGroup: (index: number) => () => void;
  prefix: string;
  depth: number;
  test?: boolean;
};

export const Item = ({
  index,
  addNewGroup,
  removeGroup,
  prefix,
  depth,
  test,
}: ItemProps) => {
  const { control } = useFormContext<Menu>();

  const item = useWatch({ control, name: prefix } as never);

  if (test) console.log("❌ item", { item, index, prefix });

  // const handleRemoveItem = () => {
  //   removeGroup?.(itemIndex);

  //   if (getValues().groups[groupIndex].length === 0) removeGroup?.(groupIndex);
  // };

  return (
    <div style={{ paddingLeft: depth > 0 ? `28px` : "0" }}>
      {item.state === "edit" ? (
        <div className='px-6 py-4 bg-secondary'>
          <ItemForm
            index={index}
            prefix={prefix}
            addNewGroup={addNewGroup}
            removeGroup={removeGroup}
            depth={depth}
          />
        </div>
      ) : (
        <ItemDone
          index={index}
          prefix={prefix}
          addNewGroup={addNewGroup}
          removeGroup={removeGroup}
          depth={depth}
        />
      )}
    </div>
  );
};

type ItemFormProps = ItemProps;

export const ItemForm = ({ index, prefix, removeGroup }: ItemFormProps) => {
  const { control, setValue } = useFormContext<Menu>();

  const item = useWatch({
    control,
    name: prefix,
  } as never) as TItem;

  const onSubmit = (values: z.infer<typeof itemFormSchema>) => {
    //@ts-expect-error TODO: fix
    setValue(prefix as `groups.${number}.${number}`, {
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
      //@ts-expect-error TODO: fix
      setValue(prefix as `groups.${number}.${number}`, {
        ...item,
        state: "done",
      });

      return;
    }

    form.reset(InitialItemState);
  };

  return (
    <div className='px-6 py-5 flex flex-col bg-white border-border border-[1px] rounded-md relative'>
      <Button
        variant='ghost'
        className='absolute h-10 w-10 p-0 top-5 right-8'
        onClick={() => removeGroup?.(index)}
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
  );
};

type ItemDoneProps = ItemProps;

export const ItemDone = ({ index, prefix, depth }: ItemDoneProps) => {
  const { control, setValue } = useFormContext<Menu>();
  const { fields, addNewGroup, removeGroup } = useMenuFormFields(prefix);

  const item = useWatch({
    control,
    name: prefix,
  } as never) as TItem;

  const handleEditItem = () => {
    //@ts-expect-error TODO: fix
    setValue(prefix as `groups.${number}.${number}`, {
      ...item,
      state: "edit",
    });
  };

  // const handleAddItem = () => {
  //   //@ts-expect-error TODO: fix
  //   setValue(prefix as `groups.${number}.${number}`, {
  //     ...item,
  //     groups: [...item.groups, InitialItemState],
  //   });
  // };

  return (
    <div>
      <div className='flex items-center justify-between p-4 bg-white rounded-tl-md rounded-tr-md border-b'>
        <div>
          <h3 className='text-lg font-semibold text-gray-800'>{item.name}</h3>
          <p className='text-sm '>{item.link}</p>
        </div>

        <div className='flex items-center border rounded-md'>
          <Button variant='secondary' onClick={removeGroup(index)}>
            Usuń
          </Button>
          <span className='h-9 w-px bg-border' aria-hidden='true' />
          <Button variant='secondary' onClick={handleEditItem}>
            Edytuj
          </Button>
          <span className='h-9 w-px bg-border' aria-hidden='true' />
          <Button variant='secondary' onClick={addNewGroup}>
            Dodaj pozycję menu
          </Button>
        </div>
      </div>
      {fields.map((item, index) => (
        <Item
          key={item.id}
          index={index}
          prefix={`${prefix}groups.${index}.`}
          depth={depth + 1}
          addNewGroup={addNewGroup}
          removeGroup={removeGroup}
        />
      ))}
    </div>
  );
};
