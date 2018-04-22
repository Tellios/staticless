import { Action, Reducer } from 'redux';
import { settingsRepository } from '../settings/SettingsRepository';

const initialState: Client.ISettingsState = {
    settings: settingsRepository.get(),
    open: false
};

export const settingsReducer: Reducer<Client.ISettingsState> = (
    state = initialState,
    action: Action
) => {
    switch (action.type) {
        case 'SETTINGS_GET':
            return {
                ...state,
                settings: (action as Client.IAction<Client.ISettings>).payload
            };
        case 'SETTINGS_OPEN':
            return {
                ...state,
                open: true
            };
        case 'SETTINGS_CLOSE':
            return {
                ...state,
                open: false
            };
        default:
            return state;
    }
};
