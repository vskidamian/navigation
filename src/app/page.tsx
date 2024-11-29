"use client";

import { Groups } from "@/components/Group";
import { Menu } from "@/type";
import { FormProvider, useForm } from "react-hook-form";

export default function Home() {
  const methods = useForm<Menu>({
    defaultValues: {
      groups: [],
    },
  });

  console.log("✅", methods.watch());

  return (
    <FormProvider {...methods}>
      <Groups />
    </FormProvider>
  );
}
