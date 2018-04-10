import { Action, Reducer } from 'redux';

const initialState: Client.IWikiState = {
    menu: [],
    menuError: null,
    menuLoaded: false,
    menuLoading: false,

    page: null,
    pageError: null,
    pageLoaded: false,
    pageLoading: false
};

export const wikiReducer: Reducer<Client.IWikiState> = (state = initialState, action: Action) => {
    switch (action.type) {
        case 'FETCH_MENU_PENDING':
            return {
                ...state,
                menuLoaded: false,
                menuLoading: true
            };
        case 'FETCH_MENU_REJECTED':
            return {
                ...state,
                menuLoaded: true,
                menuLoading: false,
                menuError: (action as Client.IAction<Error>).payload
            };
        case 'FETCH_MENU_LOADED':
            return {
                ...state,
                menuLoaded: true,
                menuLoading: false,
                menu: (action as Client.IAction<Staticless.GitLab.IWikiPageTreeItem[]>).payload
            };
        case 'FETCH_PAGE_PENDING':
            return {
                ...state,
                pageLoaded: false,
                pageLoading: true
            };
        case 'FETCH_PAGE_REJECTED':
            return {
                ...state,
                pageLoaded: true,
                pageLoading: false,
                pageError: (action as Client.IAction<Error>).payload
            };
        case 'FETCH_PAGE_LOADED':
            return {
                ...state,
                pageLoaded: true,
                pageLoading: false,
                page: (action as Client.IAction<Staticless.GitLab.IWikiPage>).payload
            };
        default:
            return state;
    }
};
