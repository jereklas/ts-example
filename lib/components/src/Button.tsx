import React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@material-ui/core";

type ButtonProps = {
  name: "alice" | "bob";
} & MuiButtonProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props: ButtonProps, ref) => {
  const { name, ...other } = props;
  return (
    <MuiButton ref={ref} {...other}>
      hello {name}, click me
    </MuiButton>
  );
});

export default Button;
export type { ButtonProps };
