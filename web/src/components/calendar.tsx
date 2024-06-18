import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/schema/event";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addMonths,
  format,
  fromUnixTime,
  getDate,
  getDaysInMonth,
  getUnixTime,
  isSameDay,
  isToday,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useDeferredValue, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateEventPayload, createEvent, findAllEvents } from "@/api/calendar";

function getLength(daysInMonth: number): number {
  const daysInWeek = 7;
  return daysInMonth % daysInWeek === 0 ? daysInWeek * 4 : daysInWeek * 5;
}

// hours, minutes
function toTime(str: string): [number, number] {
  const arr = str.split(":");

  if (arr.length < 2) {
    return [0, 0];
  }

  return [parseInt(arr[0]), parseInt(arr[1])];
}

const FormSchema = CalendarEvent.pick({ type: true }).extend({
  from: z.string(),
  to: z.string(),
});

type FormSchema = z.infer<typeof FormSchema>;

const findAllQueryKey = "find-all-events";
export default function Calendar(): ReactNode {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [findAllQueryKey],
    queryFn: findAllEvents,
  });
  const mutation = useMutation({
    mutationKey: ["create-calendar-event"],
    mutationFn: createEvent,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [findAllQueryKey] });
    },
  });
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const daysInMonth = getDaysInMonth(currentDate);
  const [selectedDay, setSelectedDay] = useState<number>();
  const deferredSelectedDay = useDeferredValue(selectedDay);
  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "shift",
    },
  });

  const day = selectedDay ?? deferredSelectedDay;
  const date = day ? setDate(currentDate, day) : undefined;
  const events = query.data ?? [];

  function handleSubmit(values: FormSchema) {
    if (date) {
      const [fromHours, fromMinutes] = toTime(values.from);
      const [toHours, toMinutes] = toTime(values.to);

      let fromDate = setHours(date, fromHours);
      fromDate = setMinutes(fromDate, fromMinutes);
      fromDate = setSeconds(fromDate, 0);

      let toDate = setHours(date, toHours);
      toDate = setMinutes(toDate, toMinutes);
      toDate = setSeconds(toDate, 0);
      const payload: CreateEventPayload = {
        from: getUnixTime(fromDate),
        to: getUnixTime(toDate),
        type: values.type,
      };
      mutation.mutate(payload);
    }
  }

  function nextMonth() {
    setCurrentDate((prev) => addMonths(prev, 1));
  }

  function prevMonth() {
    setCurrentDate((prev) => subMonths(prev, 1));
  }

  function getCell(_: unknown, i: number): ReactNode {
    const day = i + 1;
    const isDayOfMonth = day <= daysInMonth;
    const date = setDate(currentDate, day);
    // TODO: check kung same day or hindi yung from at to
    // assume muna na same day lang
    //
    // TODO: check kung nag ooverlap sa existing events yung from at to

    const eventsToday = events.filter((v) =>
      isSameDay(date, fromUnixTime(v.from)),
    );

    return (
      <Button
        variant="ghost"
        className={cn(
          "rounded-none w-full h-28 border-l border-b relative",
          day === getDate(currentDate) && isToday(currentDate) && "bg-sky-200",
          day === getDate(currentDate) &&
            !isToday(currentDate) &&
            "bg-gray-200",
        )}
        key={i}
        onClick={isDayOfMonth ? () => setSelectedDay(day) : undefined}
      >
        <span className="absolute top-1 left-1">{isDayOfMonth ? day : ""}</span>
        <div className="flex flex-col">
          {eventsToday.map((event, i) => (
            <span key={i} className="rounded bg-sky-300 my-1 p-1">
              {format(fromUnixTime(event.from), "p")} -{" "}
              {format(fromUnixTime(event.to), "p")}
            </span>
          ))}
        </div>
      </Button>
    );
  }

  if (query.isPending) {
    return <p>loading...</p>;
  }

  return (
    <>
      <Dialog
        open={!!selectedDay}
        onOpenChange={(isOpen) => !isOpen && setSelectedDay(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{date && format(date, "PPPP")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className="flex justify-center gap-2">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight">
          {format(currentDate, "MMMM yyyy")}
        </h1>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 mt-10 mx-10 border-t border-r">
        {Array.from({ length: getLength(daysInMonth) }, getCell)}
      </div>
    </>
  );
}
