import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from './AppContainer';
import { themeLoader } from './settings/ThemeLoader';
import { Provider } from 'react-redux';
import { store } from './state/store';
import './app.css';

themeLoader.loadTheme();

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root')
);
