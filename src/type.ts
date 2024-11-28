export type Group = Item[];

export type Item = {
  name: string;
  link: string;
  state: "edit" | "done";
  items: Item[];
};

export const InitialItemState: Item = {
  name: "",
  link: "",
  state: "edit",
  items: [],
};

export type Menu = {
  groups: Group[];
};
