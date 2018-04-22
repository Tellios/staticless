import { settingsRepository } from './SettingsRepository';

const CSS_THEME_ID = 'theme-css-element';

class ThemeLoader {
    public loadTheme(theme?: Client.CodeTheme) {
        if (!theme) {
            const settings = settingsRepository.get();
            theme = settings.codeTheme;
        }

        this.removeExistingElementIfExists();
        const cssElement = this.createCssElement(theme);
        this.addCssElement(cssElement);
    }

    private createCssElement(theme: Client.CodeTheme) {
        const link = document.createElement('link');
        link.id = CSS_THEME_ID;
        link.rel = 'stylesheet';
        link.href = `/code-block-styles/${theme}.css`;

        return link;
    }

    private removeExistingElementIfExists() {
        const existingElement = document.getElementById(CSS_THEME_ID);

        if (existingElement !== null) {
            existingElement.remove();
        }
    }

    private addCssElement(cssElement: HTMLLinkElement) {
        document.getElementsByTagName('head')[0].appendChild(cssElement);
    }
}

export const themeLoader = new ThemeLoader();
