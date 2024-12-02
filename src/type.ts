export type Groups = {
  groups: {
    name: string;
    link: string;
    state: "edit" | "done";
    groups?: GroupItem[];
  }[];
};

export type GroupItem = {
  name: string;
  link: string;
  state: "edit" | "done";
  groups?: GroupItem[];
};

export const InitialItemState: GroupItem = {
  name: "",
  link: "",
  state: "edit",
  groups: [],
};

export type Menu = {
  menu: Groups[];
};
