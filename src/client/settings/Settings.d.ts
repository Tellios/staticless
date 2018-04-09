declare namespace Client {
    type CodeTheme =
        | 'atom-one-dark'
        | 'atom-one-light'
        | 'monokai'
        | 'solarized-dark'
        | 'solarized-light'
        | 'tomorrow';

    interface ISettings {
        codeTheme: CodeTheme;
        wikiMenuOpen: boolean;
    }

    interface ISettingsState {
        settings: ISettings;
        open: boolean;
    }
}
