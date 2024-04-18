// LayoutSelector.tsx

import { Button } from "@/components/ui/button";
import { HiViewGrid, HiViewList, HiViewBoards } from "react-icons/hi";
import { BsGrid3X3GapFill } from "react-icons/bs";

interface LayoutSelectorProps {
  layout: "grid" | "list" | "cards";
  onLayoutChange: (newLayout: "grid" | "list" | "cards") => void;
}

const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  layout,
  onLayoutChange,
}) => {
  return (
    <div className="flex justify-end mb-4">
      <Button
        variant={layout === "cards" ? "secondary" : "ghost"}
        onClick={() => onLayoutChange("cards")}
      >
        <HiViewList className="h-6 w-6" />
      </Button>
      <Button
        variant={layout === "list" ? "secondary" : "ghost"}
        onClick={() => onLayoutChange("list")}
        className="mr-2"
      >
        <HiViewGrid className="h-6 w-6" />
      </Button>

      <Button
        variant={layout === "grid" ? "secondary" : "ghost"}
        onClick={() => onLayoutChange("grid")}
        className="mr-2"
      >
        <BsGrid3X3GapFill className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default LayoutSelector;
