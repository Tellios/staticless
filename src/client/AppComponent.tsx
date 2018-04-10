import * as React from 'react';
import { connect } from 'react-redux';
import * as request from 'superagent';
import Reboot from 'material-ui/Reboot';
import * as styles from './AppComponent.css';
import { HeaderComponent } from './header/HeaderComponent';
import { NavContainer } from './nav/NavContainer';
import { PageContainer } from './page/PageContainer';
import { SettingsContainer } from './settings/SettingsContainer';
import { LoadingComponent } from './components/LoadingComponent';
import { settingsOpen } from './state/settingsActions';
import { fetchConfig, selectSource } from './state/configActions';
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
    selectSource(source: Staticless.Config.ISource): void;
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
    selectSource: source => dispatch(selectSource(source)),
    fetchPage: (sourceName, slug, addToHistory) =>
        dispatch(fetchPage(sourceName, slug, addToHistory))
});

export const AppContainer = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<IAppComponentProps & IAppComponentDispatch> {
        public componentDidMount() {
            window.onpopstate = event => {
                if (!event.state) {
                    return;
                }

                console.log(event);
                const { sourceName, slug } = event.state;

                if (
                    this.props.selectedSource &&
                    this.props.selectedSource.name !== decodeURIComponent(sourceName)
                ) {
                    this.props.selectSource(sourceName);
                }

                this.props.fetchPage(sourceName, slug, false);
            };

            this.props.configLoad();
        }

        public componentDidUpdate(oldProps: IAppComponentProps & IAppComponentDispatch) {
            const { sources, selectedSource, configLoaded, config } = this.props;

            if (configLoaded && config !== oldProps.config) {
                if (window.location.pathname === '/') {
                    this.props.selectSource(sources[0]);
                } else {
                    const path = window.location.pathname.substr(1);

                    if (path.length > 0) {
                        const pathSplit = path.split('/');

                        if (pathSplit.length > 0) {
                            const source = this.props.sources.find(
                                s => decodeURIComponent(pathSplit[0]) === s.name
                            );

                            if (source) {
                                const slug =
                                    pathSplit.length > 1
                                        ? pathSplit.slice(1).join('/')
                                        : source.homeSlug;

                                this.props.selectSource(source);
                                this.props.fetchPage(source.name, slug, false);
                            }
                        }
                    }
                }
            } else if (selectedSource && selectedSource !== oldProps.selectedSource) {
                console.log('SELECTED SOURCE CHANGED', selectedSource);
            }
        }

        public render() {
            return (
                <div className={styles.Root}>
                    <Reboot />
                    {this.props.config && <HeaderComponent />}
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
    }
);
