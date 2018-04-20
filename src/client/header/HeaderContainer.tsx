import * as React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import { withStyles, WithStyles } from 'material-ui/styles';
import { Theme } from 'material-ui/styles/createMuiTheme';
import { settingsSet, settingsOpen } from '../state/settingsActions';
import { selectSource } from '../state/configActions';
import { fetchPage } from '../state/wikiActions';
import { SourceSelectorComponent } from './SourceSelectorComponent';

export interface IHeaderComponentProps {
    title: string;
    selectedSource?: Staticless.Config.ISource;
    sources?: Staticless.Config.ISource[];
    wikiMenuOpen: boolean;
}

export interface IHeaderComponentDispatch {
    selectSource(source: Staticless.Config.ISource): void;
    settingsSave(settings: Partial<Client.ISettings>): void;
    fetchPage(sourceName: string, slug: string, addToHistory: boolean): void;
    settingsOpen(): void;
}

const decorate = withStyles((theme: Theme) => ({
    headerText: {
        cursor: 'pointer',
        marginLeft: theme.spacing.unit
    }
}));

const mapStateToProps = (storeState: Client.IState): IHeaderComponentProps => {
    return {
        wikiMenuOpen: storeState.settings.settings.wikiMenuOpen,
        selectedSource: storeState.config.selectedSource,
        sources: storeState.config.sources,
        title: storeState.config.config ? storeState.config.config.title : ''
    };
};

const mapDispatchToProps = (dispatch: any): IHeaderComponentDispatch => {
    return {
        settingsSave: settings => dispatch(settingsSet(settings)),
        settingsOpen: () => dispatch(settingsOpen()),
        selectSource: source => dispatch(selectSource(source, true)),
        fetchPage: (sourceName, slug, addToHistory) =>
            dispatch(fetchPage(sourceName, slug, addToHistory))
    };
};

export const HeaderContainer: any = connect(mapStateToProps, mapDispatchToProps)(
    decorate(
        class extends React.Component<
            IHeaderComponentProps & IHeaderComponentDispatch & WithStyles<'headerText'>
        > {
            public render() {
                return (
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="Menu"
                                title="Menu"
                                onClick={this.handleMenuClick}
                            >
                                <Icon>menu</Icon>
                            </IconButton>

                            <Typography
                                className={this.props.classes.headerText}
                                title={this.props.title}
                                onClick={this.handleTitleClick}
                                color="inherit"
                                variant="title"
                                style={{ flex: 1 }}
                            >
                                {this.props.title}
                            </Typography>

                            {this.props.sources &&
                                this.props.sources.length > 1 && (
                                    <SourceSelectorComponent
                                        sources={this.props.sources}
                                        selectedSource={this.props.selectedSource}
                                        onSelectSource={this.handleSelectSource}
                                    />
                                )}

                            <IconButton
                                color="inherit"
                                aria-label="Settings"
                                title="Settings"
                                onClick={this.props.settingsOpen}
                            >
                                <Icon>settings</Icon>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                );
            }

            private handleMenuClick = () => {
                this.props.settingsSave({ wikiMenuOpen: !this.props.wikiMenuOpen });
            };

            private handleTitleClick = () => {
                if (this.props.selectedSource) {
                    this.props.fetchPage(
                        this.props.selectedSource.name,
                        this.props.selectedSource.homeSlug,
                        true
                    );
                }
            };

            private handleSelectSource = (e: React.ChangeEvent<HTMLSelectElement>) => {
                if (this.props.sources) {
                    const selectedSource = this.props.sources.find(
                        source => source.name === e.target.value
                    );

                    if (selectedSource) {
                        this.props.selectSource(selectedSource);
                        this.props.fetchPage(selectedSource.name, selectedSource.homeSlug, false);
                    }
                }
            };
        }
    )
);
