import { getDaysInMonth } from "date-fns";
import { ReactNode } from "react";
import { Button } from "./ui/button";

type CalendarProps = {
  date: Date;
};

function getlength(daysInMonth: number): number {
  const daysInWeek = 7;
  return daysInMonth % daysInWeek === 0 ? daysInWeek * 4 : daysInWeek * 5;
}

export default function Calendar(props: CalendarProps): ReactNode {
  const daysInMonth = getDaysInMonth(props.date);

  return (
    <div className="grid grid-cols-7 mt-10 mx-10 border-t border-r">
      {Array.from({ length: getlength(daysInMonth) }, (_, i) => (
        <Button
          variant="ghost"
          className="rounded-none w-full h-20 border-l border-b"
          key={i}
        >
          {i + 1 <= daysInMonth ? i + 1 : ""}
        </Button>
      ))}
    </div>
  );
}
