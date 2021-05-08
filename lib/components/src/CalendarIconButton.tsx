import React, { cloneElement, ReactElement, ReactNode } from "react";
import clsx from "clsx";
import { IconButtonProps, SvgIconProps } from "@material-ui/core";

type CalendarIconProps = {
  Button: ReactNode;
  ButtonDefault: ReactNode;
  ButtonProps: IconButtonProps | undefined;
  className: string | undefined;
  Icon: ReactNode;
  IconDefault: ReactNode;
  IconProps: SvgIconProps | undefined;
  name: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CalendarIconButton = ({
  Button,
  ButtonDefault,
  ButtonProps,
  className = undefined,
  Icon,
  IconDefault,
  IconProps,
  name,
  onClick,
}: CalendarIconProps) => {
  const IconComp = Icon
    ? cloneElement(Icon as ReactElement, { ...IconProps })
    : cloneElement(IconDefault as ReactElement, { ...IconProps });

  // @ts-ignore
  const { className: btnClassName } = ButtonProps ? ButtonProps : { className: undefined };

  const ButtonComp = Button
    ? cloneElement(
        Button as ReactElement,
        {
          "aria-label": name,
          className: clsx(className, btnClassName),
          onClick: onClick,
          ...ButtonProps,
        },
        IconComp
      )
    : cloneElement(
        ButtonDefault as ReactElement,
        {
          "aria-label": name,
          className: clsx(className, btnClassName),
          onClick: onClick,
          ...ButtonProps,
        },
        IconComp
      );

  return ButtonComp;
};
export default CalendarIconButton;
