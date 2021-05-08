import { useState, useContext, useEffect, createRef } from "react";
import { css } from "@emotion/react";
import CalendarHeader from "./CalendarHeader";
import { DatePickerContext } from "./DatePicker";

const calendar = css({
  display: "grid",
  gridTemplateColumns: "repeat(7,32px)",
  gridAutoRows: "32px",
  gap: "4px",
  "& .selected": {
    backgroundColor: "red",
  },
});

const dayOfWeek = css({
  alignSelf: "center",
  justifySelf: "center",
  fontSize: "14px",
  fontWeight: 700,
});

const day = css({
  fontSize: "14px",
});

const getDaysInMonth = (month: number, year: number) => {
  const days = [];
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < totalDays; i += 1) {
    days.push(i + 1);
  }
  return days;
};

const getFirstDayOfMonth = (month: number, year: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 7 : day;
};

const Calendar = (): JSX.Element => {
  const selectedRef = createRef<HTMLButtonElement>();
  const { dayLabels, date: startDate, onDateChanged, setOpen } = useContext(DatePickerContext);
  const [data, setData] = useState({
    year: startDate.getFullYear(),
    month: startDate.getMonth(),
    day: startDate.getDate(),
    closing: false,
  });
  const daysInMonth = getDaysInMonth(data.month, data.year);
  const firstDayOfMonth = getFirstDayOfMonth(data.month, data.year);

  const handleDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const date = new Date(`${data.month + 1}/${e.currentTarget.getAttribute("id")}/${data.year}`);
    setData({
      month: date.getMonth(),
      day: date.getDate(),
      year: date.getFullYear(),
      closing: true,
    });
    onDateChanged(date);
    setOpen(false);
  };

  const handleMonthChange = (month: number, year: number) => {
    const dayBtn = document.querySelector(`button[id="${data.day}"]`);
    dayBtn?.classList.remove("selected", "selectedDay");
    let day = startDate.getDate();
    const daysInMonth = getDaysInMonth(month, year);
    day = day > daysInMonth[daysInMonth.length] ? daysInMonth[daysInMonth.length] : day;
    setData({ month, day, year, closing: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const currId = Number(e.currentTarget.getAttribute("id"));
    let nextFocus = null as HTMLElement | null;
    if (e.key === "ArrowUp") {
      nextFocus = document.getElementById(`${currId - 7}`);
    }
    if (e.key === "ArrowDown") {
      nextFocus = document.getElementById(`${currId + 7}`);
    }
    if (e.key === "ArrowRight") {
      nextFocus = document.getElementById(`${currId + 1}`);
    }
    if (e.key === "ArrowLeft") {
      nextFocus = document.getElementById(`${currId - 1}`);
    }

    if (nextFocus) {
      document.activeElement?.classList.remove("focused");
      nextFocus.classList.add("focused");
      nextFocus.focus();
    }
  };

  useEffect(() => {
    selectedRef.current?.focus();
  }, [selectedRef]);

  return (
    <div css={{ padding: "24px", width: "fit-content" }}>
      <CalendarHeader month={data.month} year={data.year} onMonthYearChanged={handleMonthChange} />
      <div role="region" aria-label="Calendar" className="calendar" css={calendar}>
        {dayLabels.map((d) => (
          <span key={d} css={dayOfWeek}>
            {d}
          </span>
        ))}
        {daysInMonth.map((d, i) => {
          let selectedClass = data.closing && d === data.day ? "selected selectedDay" : undefined;
          if (!selectedClass) {
            selectedClass =
              d === data.day &&
              data.month === startDate.getMonth() &&
              data.year === startDate.getFullYear()
                ? "selected selectedDay"
                : undefined;
          }
          return (
            <button
              key={d}
              id={`${d}`}
              className={selectedClass}
              ref={selectedClass ? selectedRef : undefined}
              css={[day, { gridColumn: i === 0 ? firstDayOfMonth : undefined }]}
              onClick={handleDayClick}
              onKeyDown={handleKeyDown}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
