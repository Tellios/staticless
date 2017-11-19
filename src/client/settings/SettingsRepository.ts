
const STORAGE_KEY = "staticless-settings";
const DEFAULT_SETTINGS: Client.ISettings = {
    codeTheme: "atom-one-dark"
};

class SettingsRepository {
    public get(): Client.ISettings {
        const settings = localStorage.getItem(STORAGE_KEY) as string | null;

        if (settings == null) {
            return { ...DEFAULT_SETTINGS };
        }

        return JSON.parse(settings) as Client.ISettings;
    }

    public set(settings: Client.ISettings): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
}

export const settingsRepository = new SettingsRepository();
