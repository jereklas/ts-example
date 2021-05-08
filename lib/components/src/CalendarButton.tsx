import { useState, useContext } from "react";
import { IconButton, Popover } from "@material-ui/core";
import { Today } from "@material-ui/icons";
import { DatePickerContext } from "./DatePicker";
import Calendar from "./Calendar";
import CalendarIconButton from "./CalendarIconButton";

const CalendarButton = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const { open, setOpen, components, componentProps } = useContext(DatePickerContext);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const sibling = e.currentTarget.previousSibling as HTMLElement;
    if (sibling?.getAttribute("id") === "date-picker") {
      setAnchorEl(sibling);
    } else {
      setAnchorEl(e.currentTarget);
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <CalendarIconButton
        name="Calendar Open"
        Button={components?.CalendarButton}
        ButtonDefault={<IconButton />}
        ButtonProps={componentProps?.CalendarButtonProps}
        className="btnOpenCalendar"
        Icon={components?.CalendarButtonIcon}
        IconDefault={<Today />}
        IconProps={componentProps?.CalendarButtonIconProps}
        onClick={handleOpen}
      />
      <Popover
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        {...componentProps?.CalendarPopoverProps}
      >
        <Calendar />
      </Popover>
    </>
  );
};
export default CalendarButton;
