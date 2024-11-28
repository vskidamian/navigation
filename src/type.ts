export type Group = TItem[];

export type TItem = {
  name: string;
  link: string;
  state: "edit" | "done";
  groups: Group;
};

export const InitialItemState: TItem = {
  name: "",
  link: "",
  state: "edit",
  groups: [],
};

export type Menu = {
  groups: Group[];
};
