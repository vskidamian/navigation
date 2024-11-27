import { InitialMenuItemState, MenuForm } from "@/type";
import { UseFieldArrayAppend } from "react-hook-form";

type EmptyProps = {
  append: UseFieldArrayAppend<MenuForm, "menuItems">;
};

export const Empty = ({ append }: EmptyProps) => {
  return (
    <div className="w-full text-center">
      <h1 className="font-semibold leading-6">Menu jest puste</h1>
      <p className="text-sm leading-5 pb-6">
        W tym menu nie ma jeszcze żadnych linków.
      </p>
      <button onClick={() => append(InitialMenuItemState)}>
        Dodaj pozycję menu
      </button>
    </div>
  );
};
