import * as React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { withStyles, WithStyles } from 'material-ui/styles';
import { Theme } from 'material-ui/styles/createMuiTheme';
import { settingsSet, settingsOpen } from '../state/settingsActions';
import { selectSource } from '../state/configActions';
import { fetchPage } from '../state/wikiActions';

export interface IHeaderComponentProps {
    title: string;
    selectedSource?: Staticless.Config.ISource;
    sources?: Staticless.Config.ISource[];
    wikiMenuOpen: boolean;
}

export interface IHeaderComponentDispatch {
    selectSource(source: Staticless.Config.ISource): void;
    settingsSave(settings: Partial<Client.ISettings>): void;
    fetchPage(sourceName: string, slug: string): void;
    settingsOpen(): void;
}

const decorate = withStyles((theme: Theme) => ({
    root: {
        marginRight: theme.spacing.unit,
        color: theme.palette.common.white
    },
    headerText: {
        cursor: 'pointer',
        marginLeft: theme.spacing.unit
    },
    select: {
        color: theme.palette.common.white
    },
    icon: {
        color: theme.palette.common.white
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
        selectSource: source => dispatch(selectSource(source)),
        fetchPage: (sourceName, slug) => dispatch(fetchPage(sourceName, slug))
    };
};

export const HeaderComponent: any = connect(mapStateToProps, mapDispatchToProps)(
    decorate(
        class extends React.Component<
            IHeaderComponentProps &
                IHeaderComponentDispatch &
                WithStyles<'root'> &
                WithStyles<'headerText'> &
                WithStyles<'select'> &
                WithStyles<'icon'>
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
                                menu
                            </IconButton>

                            <Typography type="title" color="inherit" style={{ flex: 1 }}>
                                <span
                                    className={this.props.classes.headerText}
                                    onClick={this.handleTitleClick}
                                >
                                    {this.props.title}
                                </span>
                            </Typography>

                            {this.props.sources &&
                                this.props.sources.length > 1 && (
                                    <span>
                                        <InputLabel classes={{ root: this.props.classes.root }}>
                                            Selected Wiki:
                                        </InputLabel>
                                        <Select
                                            classes={{
                                                select: this.props.classes.select,
                                                icon: this.props.classes.icon
                                            }}
                                            value={this.getSelectedSourceName()}
                                            onChange={this.handleSelectSource}
                                            disableUnderline={true}
                                        >
                                            {this.props.sources.map((source, index) => {
                                                const selected =
                                                    this.props.selectedSource &&
                                                    this.props.selectedSource.name === source.name;
                                                return (
                                                    <MenuItem key={index} value={source.name}>
                                                        {source.name}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </span>
                                )}

                            <IconButton
                                color="inherit"
                                aria-label="Settings"
                                title="Settings"
                                onClick={this.props.settingsOpen}
                            >
                                settings
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
                        this.props.selectedSource.homeSlug
                    );
                }
            };

            private handleSelectSource = (e: React.ChangeEvent<HTMLInputElement>) => {
                if (this.props.sources) {
                    const selectedSource = this.props.sources.find(
                        source => source.name === e.target.value
                    );

                    if (selectedSource) {
                        this.props.selectSource(selectedSource);
                    }
                }
            };

            private getSelectedSourceName(): string {
                if (!this.props.sources) {
                    throw new Error('No sources available');
                }

                return this.props.selectedSource
                    ? this.props.selectedSource.name
                    : this.props.sources[0].name;
            }
        }
    )
);
