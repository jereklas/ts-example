import ReactDOM from "react-dom";
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
import App from "./App";
import { ThemeProvider } from "@emotion/react";

const theme = createMuiTheme();

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <App />
      </StylesProvider>
    </ThemeProvider>
  </MuiThemeProvider>,
  document.getElementById("root")
);

export default App;
