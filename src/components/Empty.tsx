import { InitialItemState, Menu } from "@/type";
import { UseFieldArrayAppend } from "react-hook-form";

type EmptyProps = {
  append: UseFieldArrayAppend<Menu, "groups">;
};

export const Empty = ({ append }: EmptyProps) => {
  return (
    <div className="w-full text-center pb-8">
      <h1 className="font-semibold leading-6">Menu jest puste</h1>
      <p className="text-sm leading-5 pb-6">
        W tym menu nie ma jeszcze żadnych linków.
      </p>
      <button onClick={() => append([[InitialItemState]])}>
        Dodaj pozycję menu
      </button>
    </div>
  );
};
