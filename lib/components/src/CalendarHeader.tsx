import { css } from "@emotion/react";
import { Popover, IconButton } from "@material-ui/core";
import { ArrowDropDown, NavigateNext, NavigateBefore } from "@material-ui/icons";
import { createRef, useEffect, useState, useContext } from "react";
import CalendarIconButton from "./CalendarIconButton";
import { DatePickerContext } from "./DatePicker";

const calendarHeader = css({
  display: "grid",
  gridTemplateColumns: "1fr 32px 32px",
  gridTemplateRows: "32px",
  gap: "4px",
});

const monthYearContainer = css({
  display: "grid",
  gridTemplateColumns: "auto 32px",
  gridAutoRows: "32px",
  justifySelf: "start",
});

const monthList = css({
  display: "grid",
  overflow: "auto",
  gridTemplateColumns: "1fr",
  gridAutoRows: "32px",
  padding: "4px",
  gap: "4px",
});

const monthYearListContainer = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  "& .selected": {
    backgroundColor: "red",
  },
});

const monthYearLabel = css({
  alignSelf: "center",
  justifySelf: "center",
  fontSize: "16px",
  margin: "0px 4px",
});

const yearList = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "32px",
  gap: "4px",
  padding: "4px",
  overflow: "auto",
});

type CalendarHeaderProps = {
  month: number;
  year: number;
  onMonthYearChanged: (newMonth: number, newYear: number) => void;
};

const getNewMonthYear = (month: number, year: number) => {
  let newMonth = month;
  let newYear = year;
  if (newMonth > 11) {
    newYear += 1;
    newMonth = 0;
  }
  if (newMonth < 0) {
    newYear -= 1;
    newMonth = 11;
  }
  return [newMonth, newYear];
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const CalendarHeader = (props: CalendarHeaderProps) => {
  const { yearStart, yearEnd, components, componentProps } = useContext(DatePickerContext);
  const { month: m, year, onMonthYearChanged } = props;
  const [month, setMonth] = useState(m);
  const [open, setOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement>();
  const dateRef = createRef<HTMLDivElement>();

  useEffect(() => {
    setMonth(m);
  }, [m]);

  const date = new Date(year, month);

  const handleMonthClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMonth(Number(e.currentTarget.getAttribute("id")));
  };

  const handleYearClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMonthYearChanged(month, Number(e.currentTarget.textContent));
    setOpen(false);
  };

  const handleOpen = () => {
    const calendar = document.querySelector("div.calendar");
    // @ts-ignore -- will never be null
    setAnchorEl(dateRef.current);
    setDimensions({
      height: calendar ? calendar.clientHeight : 0,
      width: calendar ? calendar.clientWidth : 0,
    });
    setOpen(true);
  };

  const handleClose = () => {
    onMonthYearChanged(month, year);
    setOpen(false);
  };

  const onPrevClick = () => {
    const [newMonth, newYear] = getNewMonthYear(month - 1, year);
    onMonthYearChanged(newMonth, newYear);
  };

  const onNextClick = () => {
    const [newMonth, newYear] = getNewMonthYear(month + 1, year);
    onMonthYearChanged(newMonth, newYear);
  };

  const years = [];
  for (let i = yearStart; i <= yearEnd; i += 1) {
    years.push(i);
  }

  return (
    <div css={calendarHeader}>
      <div role="region" aria-label="Calendar Controls" css={monthYearContainer} ref={dateRef}>
        <span css={monthYearLabel}>
          {date.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
        <CalendarIconButton
          Button={components?.MonthYearButton}
          ButtonDefault={<IconButton />}
          ButtonProps={componentProps?.MonthYearButtonProps}
          className="btnMonthYear"
          Icon={components?.MonthYearButtonIcon}
          IconDefault={<ArrowDropDown style={{ transform: open ? "rotate(180deg)" : undefined }} />}
          IconProps={componentProps?.MonthYearButtonIconProps}
          name="Month Year Dropdown"
          onClick={handleOpen}
        />
      </div>
      <CalendarIconButton
        Button={components?.PrevMonthButton}
        ButtonDefault={<IconButton />}
        ButtonProps={componentProps?.PrevMonthButtonProps}
        className="btnPrevMonth"
        Icon={components?.PrevMonthButtonIcon}
        IconDefault={<NavigateBefore />}
        IconProps={componentProps?.PrevMonthButtonIconProps}
        name="Previous Month"
        onClick={onPrevClick}
      />
      <CalendarIconButton
        Button={components?.NextMonthButton}
        ButtonDefault={<IconButton />}
        ButtonProps={componentProps?.NextMonthButtonProps}
        className="btnNextMonth"
        Icon={components?.NextMonthButtonIcon}
        IconDefault={<NavigateNext />}
        IconProps={componentProps?.NextMonthButtonIconProps}
        name="Next Month"
        onClick={onNextClick}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        elevation={0}
        onEntered={() => {
          const currentYear = document.querySelector<HTMLElement>("button.selectedYear");
          const currentMonth = document.querySelector<HTMLElement>("button.selectedMonth");
          currentMonth?.scrollIntoView({ block: "center" });
          currentYear?.scrollIntoView({ block: "center" });
          currentMonth?.focus();
        }}
        transitionDuration={0}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        {...componentProps?.MonthYearPopoverProps}
      >
        <div
          css={[
            monthYearListContainer,
            {
              height: `${dimensions.height + 5}px`,
              width: `${dimensions.width}px`,
            },
          ]}
        >
          <div css={monthList}>
            {months.map((m, i) => (
              <button
                key={m}
                id={`${i}`}
                className={i === month ? "selected selectedMonth" : undefined}
                onClick={handleMonthClick}
              >
                {m}
              </button>
            ))}
          </div>
          <div css={yearList}>
            {years.map((y) => (
              <button
                key={y}
                className={y === year ? "selected selectedYear" : undefined}
                onClick={handleYearClick}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
};
export default CalendarHeader;
