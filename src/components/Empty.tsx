import { Button } from "./ui/button";

type EmptyProps = {
  addNewGroup: () => void;
};

export const Empty = ({ addNewGroup }: EmptyProps) => {
  return (
    <div className="w-full text-center bg-white px-5 py-6 rounded-md shadow-border">
      <h1 className="font-semibold leading-6">Menu jest puste</h1>
      <p className="text-sm leading-5 pb-6">
        W tym menu nie ma jeszcze żadnych linków.
      </p>
      <Button onClick={addNewGroup}>Dodaj nową grupę</Button>
    </div>
  );
};
