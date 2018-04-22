const STORAGE_KEY = 'staticless-settings';
const DEFAULT_SETTINGS: Client.ISettings = {
    codeTheme: 'atom-one-dark',
    wikiMenuOpen: true
};

class SettingsRepository {
    public get(): Client.ISettings {
        const settings = localStorage.getItem(STORAGE_KEY) as string | null;

        if (settings == null) {
            return { ...DEFAULT_SETTINGS };
        }

        return {
            ...DEFAULT_SETTINGS,
            ...(JSON.parse(settings) as Client.ISettings)
        };
    }

    public set(settings: Partial<Client.ISettings>): void {
        settings = { ...this.get(), ...settings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
}

export const settingsRepository = new SettingsRepository();
