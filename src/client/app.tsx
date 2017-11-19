import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppComponent } from "./AppComponent";
import { themeLoader } from "./settings/ThemeLoader";

themeLoader.loadTheme();

ReactDOM.render(
    <AppComponent />,
    document.getElementById("root")
);
