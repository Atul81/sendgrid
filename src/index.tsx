/**
 * bookFetch.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import * as serviceWorker from './serviceWorker';
import {history} from './utils/history';
import 'sanitize.css/sanitize.css';
import 'antd/dist/antd.css';
import './styles.scss';

// Import root app
import {App} from './app';

import configureStore from './store/configureStore';

// Initialize languages
import './locales/i18n';
import {BrowserRouter} from "react-router-dom";

// Create redux store with history
const store = configureStore(history);

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

// const themes = {
//     dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
//     light: `${process.env.PUBLIC_URL}/light-theme.css`,
//     pink: `${process.env.PUBLIC_URL}/light-pink-theme.css`
// };

interface Props {
    Component: typeof App;
}

const ConnectedApp = ({Component}: Props) => (
    <BrowserRouter>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <React.StrictMode>
                    <Component/>
                </React.StrictMode>
            </ConnectedRouter>
        </Provider>
    </BrowserRouter>
);
const render = (Component: typeof App) => {
    ReactDOM.render(<ConnectedApp Component={Component}/>, MOUNT_NODE);
};

if (module.hot) {
    // Hot reloadable translation json files and app
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept(['./app', './locales/i18n'], () => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        const App = require('./app').App;
        render(App);
    });
}

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
