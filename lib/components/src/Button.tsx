import React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@material-ui/core";

type ButtonProps = {
  name: "alice" | "bob";
} & MuiButtonProps;

const Button = (props: ButtonProps) => {
  const { name, ...other } = props;
  return (
    <MuiButton
      css={{
        backgroundColor: "red",
        "& .MuiButton-root": {
          backgroundColor: "green",
        },
      }}
      {...other}
    >
      <MuiButton>blah</MuiButton>
      hello {name}, click me
    </MuiButton>
  );
};

export default Button;
export type { ButtonProps };
