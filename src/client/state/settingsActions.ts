import { ActionCreator } from 'redux';
import { settingsRepository } from '../settings/SettingsRepository';

export const settingsClose: ActionCreator<Client.IEmptyAction> = () => ({
    type: 'SETTINGS_CLOSE'
});

export const settingsOpen: ActionCreator<Client.IEmptyAction> = () => ({
    type: 'SETTINGS_OPEN'
});

export const settingsGet: ActionCreator<Client.IAction<Client.ISettings>> = () => ({
    type: 'SETTINGS_GET',
    payload: settingsRepository.get()
});

export const settingsSet: ActionCreator<Client.IAction<Client.ISettings>> = (
    settings: Partial<Client.ISettings>
) => {
    settingsRepository.set(settings);
    return settingsGet();
};
