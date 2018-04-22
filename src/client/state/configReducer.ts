import { Action, Reducer } from 'redux';

const initialState: Client.IConfigState = {
    loaded: false,
    loading: false,
    sources: []
};

export const configReducer: Reducer<Client.IConfigState> = (
    state = initialState,
    action: Action
) => {
    switch (action.type) {
        case 'CONFIG_SELECT_SOURCE':
            return {
                ...state,
                selectedSource: (action as Client.IAction<Staticless.Config.ISource>).payload
            };
        case 'CONFIG_PENDING':
            return {
                ...state,
                loaded: false,
                loading: true
            };
        case 'CONFIG_REJECTED':
            return {
                ...state,
                error: (action as Client.IAction<Error>).payload,
                loading: false,
                loaded: true
            };
        case 'CONFIG_LOADED':
            const payload = (action as Client.IAction<Client.IConfigPayload>).payload;

            return {
                ...state,
                loaded: true,
                loading: false,
                config: payload.config,
                sources: payload.sources
            };
        default:
            return state;
    }
};
