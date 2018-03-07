import * as React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import { InputLabel } from "material-ui/Input";
import IconButton from "material-ui/IconButton";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import { withStyles, WithStyles } from "material-ui/styles";
import { Theme } from "material-ui/styles/createMuiTheme";

export interface IHeaderComponentProps {
    title: string;
    selectedSource?: Staticless.Config.ISource;
    sources?: Staticless.Config.ISource[];
    onSourceSelected(source: Staticless.Config.ISource): void;
    onMenuClick(): void;
    onTitleClick(): void;
    onSettingsClick(): void;
}

const decorate = withStyles((theme: Theme) => ({
    root: {
        marginRight: theme.spacing.unit,
        color: theme.palette.common.white
    },
    headerText: {
        cursor: "pointer",
        marginLeft: theme.spacing.unit
    },
    select: {
        color: theme.palette.common.white
    },
    icon: {
        color: theme.palette.common.white
    }
}));

export const HeaderComponent = decorate<IHeaderComponentProps>(
    class extends React.Component<
        IHeaderComponentProps
        & WithStyles<"root">
        & WithStyles<"headerText">
        & WithStyles<"select">
        & WithStyles<"icon">
        > {
        public render() {
            return (
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Menu"
                            title="Menu"
                            onClick={this.props.onMenuClick}>
                            menu
                        </IconButton>

                        <Typography type="title" color="inherit" style={{ flex: 1 }}>
                            <span className={this.props.classes.headerText} onClick={this.props.onTitleClick}>
                                {this.props.title}
                            </span>
                        </Typography>

                        {
                            this.props.sources && this.props.sources.length > 1 &&
                            <span>
                                <InputLabel classes={{root: this.props.classes.root}}>
                                    Selected Wiki:
                                </InputLabel>
                                <Select
                                    classes={{ select: this.props.classes.select, icon: this.props.classes.icon }}
                                    value={this.getSelectedSourceName()}
                                    onChange={this.handleSelectSource}
                                    disableUnderline={true}
                                >
                                    {
                                        this.props.sources.map((source, index) => {
                                            const selected = this.props.selectedSource
                                                && this.props.selectedSource.name === source.name;
                                            return (
                                                <MenuItem key={index} value={source.name}>
                                                    {source.name}
                                                </MenuItem>
                                            );
                                        })
                                    }
                                </Select>
                            </span>
                        }

                        <IconButton
                            color="inherit"
                            aria-label="Settings"
                            title="Settings"
                            onClick={this.props.onSettingsClick}>
                            settings
                        </IconButton>
                    </Toolbar>
                </AppBar>
            );
        }

        private handleSelectSource = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (this.props.sources) {
                const selectedSource =
                    this.props.sources.find((source) => source.name === e.target.value);

                if (selectedSource) {
                    this.props.onSourceSelected(selectedSource);
                }
            }
        }

        private getSelectedSourceName(): string {
            if (!this.props.sources) {
                throw new Error("No sources available");
            }

            return this.props.selectedSource
                ? this.props.selectedSource.name
                : this.props.sources[0].name;
        }
    }
);
