
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ReadingProgressProps {
  value: number;
}

const ReadingProgress = ({ value }: ReadingProgressProps) => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <Progress value={value} className="h-1 rounded-none bg-muted/20" />
    </div>
  );
};

export default ReadingProgress;
