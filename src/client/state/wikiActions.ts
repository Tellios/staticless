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

export const fetchPage = (sourceName: string, slug: string) => {
    console.log('fetchPage');
    return (dispatch: any) => {
        console.log('fetchPage - inner');
        dispatch({
            type: 'FETCH_PAGE_PENDING'
        });

        const path = `/wiki/${encodeURIComponent(sourceName)}/${encodeURIComponent(slug)}`;

        request(path).end((err, res) => {
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
