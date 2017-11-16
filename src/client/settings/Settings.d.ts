declare namespace Client {
    type CodeTheme = "light" | "dark";

    interface ISettings {
        codeTheme: CodeTheme;
    }
}
