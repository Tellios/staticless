import { createStore, combineReducers, applyMiddleware } from 'redux';
import { configReducer } from './configReducer';
import { settingsReducer } from './settingsReducer';
import { wikiReducer } from './wikiReducer';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';

const reducer = combineReducers<Client.IState>({
    config: configReducer,
    settings: settingsReducer,
    wiki: wikiReducer
});

const middleware = applyMiddleware(thunk, logger);

export const store = createStore<Client.IState, any, any, any>(reducer, middleware);
