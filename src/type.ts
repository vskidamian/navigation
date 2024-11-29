export type TItem = {
  name: string;
  link: string;
  state: "edit" | "done";
  groups?: TItem[];
};

export const InitialItemState: TItem = {
  name: "",
  link: "",
  state: "edit",
  groups: [],
};

export type Menu = {
  groups: TItem[];
};
