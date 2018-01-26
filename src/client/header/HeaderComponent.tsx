import * as React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import { withStyles, WithStyles } from "material-ui/styles";
import { Theme } from "material-ui/styles/createMuiTheme";

export interface IHeaderComponentProps {
    title: string;
    onMenuClick(): void;
    onTitleClick(): void;
    onSettingsClick(): void;
}

const decorate = withStyles((theme: Theme) => ({
    headerText: {
        cursor: "pointer",
        marginLeft: theme.spacing.unit
    }
}));

export const HeaderComponent = decorate<IHeaderComponentProps>(
    class extends React.Component<IHeaderComponentProps & WithStyles<"headerText">> {
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
    }
);
