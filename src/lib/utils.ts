import { Groups } from "@/type";
import { Active, Over, UniqueIdentifier } from "@dnd-kit/core";
import { clsx, type ClassValue } from "clsx";
import { Dispatch, SetStateAction } from "react";
import { UseFieldArrayMove } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type HandleDragEndProps = {
  active: Active;
  over: Over | null;
  fields: Record<"id", string>[];
  moveItem: UseFieldArrayMove;
};

export const handleDragEnd = ({
  active,
  over,
  fields,
  moveItem,
}: HandleDragEndProps) => {
  if (over && active.id !== over.id) {
    const activeIndex = fields.findIndex(({ id }) => id === active.id);
    const overIndex = fields.findIndex(({ id }) => id === over.id);

    if (activeIndex !== -1 && overIndex !== -1) {
      moveItem(activeIndex, overIndex);
    }
  }
};
