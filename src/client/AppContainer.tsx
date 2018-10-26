import * as React from 'react';
import { connect } from 'react-redux';
import * as styles from './AppContainer.css';
import { HeaderContainer } from './header/HeaderContainer';
import { NavContainer } from './nav/NavContainer';
import { PageContainer } from './page/PageContainer';
import { SettingsContainer } from './settings/SettingsContainer';
import { LoadingComponent } from './components/LoadingComponent';
import { settingsOpen } from './state/settingsActions';
import { fetchConfig, selectSource, selectInitialSource } from './state/configActions';
import { fetchPage } from './state/wikiActions';

export interface IAppComponentProps {
    isSettingsOpen: boolean;
    configLoading: boolean;
    configLoaded: boolean;
    config?: Staticless.Config.IFrontend;
    sources: Staticless.Config.ISource[];
    selectedSource?: Staticless.Config.ISource;
    error?: Error;
}

export interface IAppComponentDispatch {
    settingsOpen(): void;
    configLoad(): void;
    selectSource(source: Staticless.Config.ISource, addToHistory: boolean): void;
    selectInitialSource(source: Staticless.Config.ISource): void;
    fetchPage(sourceName: string, slug: string, addToHistory: boolean): void;
}

export interface IAppComponentState {
    source?: Staticless.Config.ISource;
    slug?: string;
    isMenuOpen: boolean;
    isLoadingConfig: boolean;
}

const mapStateToProps = (state: Client.IState): IAppComponentProps => ({
    isSettingsOpen: state.settings.open,
    configLoaded: state.config.loaded,
    configLoading: state.config.loading,
    config: state.config.config,
    sources: state.config.sources,
    selectedSource: state.config.selectedSource,
    error: state.config.error
});

const mapDispatchToProps = (dispatch: any): IAppComponentDispatch => ({
    settingsOpen: () => dispatch(settingsOpen()),
    configLoad: () => dispatch(fetchConfig()),
    selectSource: (source, addToHistory) => dispatch(selectSource(source, addToHistory)),
    selectInitialSource: source => dispatch(selectInitialSource(source)),
    fetchPage: (sourceName, slug, addToHistory) =>
        dispatch(fetchPage(sourceName, slug, addToHistory))
});

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<IAppComponentProps & IAppComponentDispatch> {
        public componentDidMount() {
            window.onpopstate = event => {
                const state: Client.PushState = event.state;

                if (!event.state) {
                    return this.navigateToCurrentHref();
                }

                const { sourceName, slug } = state;

                if (this.props.selectedSource && this.props.selectedSource.name !== sourceName) {
                    const source = this.props.sources.find(source => source.name === sourceName);

                    if (source) {
                        this.props.selectSource(source, false);
                    }
                }

                this.props.fetchPage(sourceName, slug, false);
            };

            this.props.configLoad();
        }

        public componentDidUpdate(oldProps: IAppComponentProps & IAppComponentDispatch) {
            const { sources, configLoaded, config } = this.props;

            if (configLoaded && config !== oldProps.config && config) {
                document.title = config.title;

                if (window.location.pathname === '/') {
                    this.props.selectInitialSource(sources[0]);
                } else {
                    this.navigateToCurrentHref();
                }
            }
        }

        public render() {
            return (
                <div className={styles.Root}>
                    {this.props.config && <HeaderContainer />}
                    <div className={styles.Container}>
                        {this.props.selectedSource && <NavContainer />}
                        {this.renderContent()}
                    </div>
                    {this.props.isSettingsOpen && <SettingsContainer />}
                </div>
            );
        }

        private renderContent() {
            if (this.props.configLoading) {
                return <LoadingComponent />;
            } else if (this.props.error) {
                return <div>{this.props.error.toString()}</div>;
            } else if (this.props.selectedSource) {
                return <PageContainer />;
            } else {
                return <div />;
            }
        }

        private navigateToCurrentHref() {
            const path = window.location.pathname.substr(1);

            if (path.length > 0) {
                const pathSplit = path.split('/');

                if (pathSplit.length > 0) {
                    const source = this.props.sources.find(
                        s => decodeURIComponent(pathSplit[0]) === s.name
                    );

                    if (source) {
                        const slug =
                            pathSplit.length > 1 ? pathSplit.slice(1).join('/') : source.homeSlug;

                        this.props.selectSource(source, false);
                        this.props.fetchPage(source.name, slug, false);
                    }
                }
            }
        }
    }
);
