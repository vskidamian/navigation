import { MenuForm } from "@/type";
import { useFormContext, useWatch } from "react-hook-form";

type MenuItemProps = {
  index: number;
};

export const MenuItem = ({ index }: MenuItemProps) => {
  const { control } = useFormContext<MenuForm>();

  const { state } = useWatch({ control, name: `menuItems.${index}` });

  return state === "edit" ? (
    <MenuItemEdit index={index} />
  ) : (
    <MenuItemDone index={index} />
  );
};

export const MenuItemEdit = ({ index }: MenuItemProps) => {
  const { setValue } = useFormContext<MenuForm>();

  const handleAddItem = () => {
    console.log("add");
    setValue(`menuItems.${index}`, {
      link: "",
      name: "",
      state: "done",
      items: [],
    });
  };
  return (
    <div className="px-6 py-5 flex flex-col">
      <p>Nazwa</p>
      <p>Link</p>
      <div className="flex flex-row gap-2">
        <button>Anuluj</button>
        <button onClick={handleAddItem}>Dodaj</button>
      </div>
    </div>
  );
};

export const MenuItemDone = ({ index }: MenuItemProps) => {
  return (
    <div className="px-6 py-5 flex flex-col">
      <p>DONE</p>
    </div>
  );
};
