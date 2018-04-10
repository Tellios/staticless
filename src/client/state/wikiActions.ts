import { ActionCreator } from 'redux';
import * as request from 'superagent';

export const fetchMenu = (sourceName: string) => {
    return (dispatch: any) => {
        dispatch({
            type: 'FETCH_MENU_PENDING'
        });

        const path = `/wiki/${encodeURIComponent(sourceName)}`;

        request.get(path).end((err, res) => {
            if (err) {
                return dispatch({
                    type: 'FETCH_MENU_REJECTED',
                    payload: err
                });
            }

            dispatch({
                type: 'FETCH_MENU_LOADED',
                payload: res.body
            });
        });
    };
};

export const fetchPage = (sourceName: string, slug: string, addToHistory: boolean) => {
    return (dispatch: any) => {
        const historyState = { sourceName, slug };
        sourceName = encodeURIComponent(sourceName);

        if (addToHistory) {
            const windowUrl = `${window.location.origin}/${sourceName}/${slug}`;
            window.history.pushState(historyState, historyState.slug, windowUrl);
        }

        dispatch({
            type: 'FETCH_PAGE_PENDING'
        });

        const apiUrl = `/wiki/${sourceName}/${slug}`;

        request(apiUrl).end((err, res) => {
            if (err) {
                return dispatch({
                    type: 'FETCH_PAGE_REJECTED',
                    payload: err
                });
            }

            dispatch({
                type: 'FETCH_PAGE_LOADED',
                payload: res.body
            });
        });
    };
};
