import { useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import { Groups, Menu } from "@/type";

export const HelperButtons = () => {
  const { getValues, setValue } = useFormContext<Menu>();

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        className="mb-8"
        onClick={() => console.log("✅GET VALUES", getValues())}
      >
        GET VALUES
      </Button>
      <Button
        variant="outline"
        className="mb-8"
        onClick={() => setValue("menu", testData)}
      >
        TEST VALUES
      </Button>
    </div>
  );
};

const testData: Groups[] = [
  {
    groups: [
      {
        name: "1",
        link: "",
        state: "done",
        groups: [
          { name: "1.1", link: "", state: "done", groups: [] },
          { name: "1.2", link: "", state: "done", groups: [] },
        ],
      },
      { name: "2", link: "", state: "done", groups: [] },
    ],
  },
];
