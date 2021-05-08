import {
  TextField,
  PopoverProps,
  IconButtonProps,
  SvgIconProps,
  TextFieldProps,
} from "@material-ui/core";
import React, { useState, createContext } from "react";
import CB from "./CalendarButton";

export const DatePickerContext = createContext({
  components: {} as DatePickerComponents | undefined,
  componentProps: {} as DatePickerComponentProps | undefined,
  date: new Date(),
  dayLabels: [""],
  onDateChanged: (newDate: Date) => {},
  open: false,
  setOpen: (open: boolean) => {},
  yearStart: 0,
  yearEnd: 0,
});

type DatePickerComponents = {
  CalendarButton?: React.ReactNode;
  CalendarButtonIcon?: React.ReactNode;
  Input?: React.ReactNode;
  MonthYearButton?: React.ReactNode;
  MonthYearButtonIcon?: React.ReactNode;
  NextMonthButton?: React.ReactNode;
  NextMonthButtonIcon?: React.ReactNode;
  PrevMonthButton?: React.ReactNode;
  PrevMonthButtonIcon?: React.ReactNode;
};

type DatePickerComponentProps = {
  CalendarButtonProps?: IconButtonProps;
  CalendarButtonIconProps?: SvgIconProps;
  CalendarPopoverProps?: Partial<PopoverProps>;
  InputProps?: TextFieldProps;
  MonthYearButtonProps?: IconButtonProps;
  MonthYearButtonIconProps?: SvgIconProps;
  MonthYearPopoverProps?: PopoverProps;
  NextMonthButtonProps?: IconButtonProps;
  NextMonthButtonIconProps?: SvgIconProps;
  PrevMonthButtonProps?: IconButtonProps;
  PrevMonthButtonIconProps?: SvgIconProps;
};

type DatePickerProps = {
  components?: DatePickerComponents;
  componentProps?: DatePickerComponentProps;
  date?: Date;
  dayLabels?: string[];
  onDateChanged?: (newDate: Date) => void;
  yearStart?: number;
  yearEnd?: number;
};

const DatePicker = ({
  components = undefined,
  componentProps = undefined,
  date: startDate = new Date(),
  dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  onDateChanged = (d: Date) => {
    console.log(d);
  },
  yearStart = 1900,
  yearEnd = 2099,
  ...other
}: DatePickerProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(startDate);

  onDateChanged = (newDate) => {
    setDate(newDate);
  };

  return (
    <DatePickerContext.Provider
      value={{
        components,
        componentProps,
        date,
        dayLabels,
        onDateChanged,
        open,
        setOpen,
        yearStart,
        yearEnd,
      }}
    >
      <TextField
        id="date-picker"
        value={date.toLocaleString("default", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })}
        css={{ width: "295px" }}
        fullWidth
        InputProps={{ endAdornment: <CB /> }}
        {...other}
      />
    </DatePickerContext.Provider>
  );
};
export default DatePicker;
export type { DatePickerProps };
