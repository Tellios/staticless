import * as request from 'superagent';
import { ActionCreator, Dispatch } from 'redux';
import { updateWindowHistory } from './updateWindowHistory';
import { fetchPage } from './wikiActions';

export const selectSource: ActionCreator<Client.IAction<Staticless.Config.ISource>> = (
    source: Staticless.Config.ISource,
    addToHistory: boolean
) => {
    if (addToHistory) {
        updateWindowHistory({
            type: 'source',
            sourceName: source.name,
            slug: source.homeSlug
        });
    }

    return {
        type: 'CONFIG_SELECT_SOURCE',
        payload: source
    };
};

export const selectInitialSource = (source: Staticless.Config.ISource) => {
    return (dispatch: Dispatch<any>) => {
        dispatch(selectSource(source, false));
        dispatch(fetchPage(source.name, source.homeSlug, false));
    };
};

export const fetchConfig = () => {
    return (dispatch: any) => {
        dispatch({
            type: 'CONFIG_PENDING'
        });

        request('/frontendConfig').end((err, res) => {
            if (err) {
                return dispatch({
                    type: 'CONFIG_REJECTED',
                    payload: err
                });
            }

            const config: Staticless.Config.IFrontend = res.body;

            request('/frontendConfig/sources').end((sourcesErr, sourcesRes) => {
                if (sourcesErr) {
                    return dispatch({
                        type: 'CONFIG_REJECTED',
                        payload: err
                    });
                }

                const sources: Staticless.Config.ISource[] = sourcesRes.body;

                return dispatch(<Client.IAction<Client.IConfigPayload>>{
                    type: 'CONFIG_LOADED',
                    payload: {
                        config,
                        sources
                    }
                });
            });
        });
    };
};
