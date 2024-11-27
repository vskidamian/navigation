export type MenuItem = {
  name: string;
  link: string;
  state: "edit" | "done";
  items: MenuItem[];
};

export const InitialMenuItemState: MenuItem = {
  name: "",
  link: "",
  state: "edit",
  items: [],
};

export type MenuForm = {
  menuItems: MenuItem[];
};
