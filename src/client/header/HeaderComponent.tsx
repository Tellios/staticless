import * as React from "react";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";

export interface IHeaderProps {
    title: string;
    onMenuClick(): void;
    onSettingsClick(): void;
}

export class HeaderComponent extends React.Component<IHeaderProps> {
    public render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="contrast"
                        aria-label="Menu"
                        title="Menu"
                        onClick={this.props.onMenuClick}>
                        menu
                    </IconButton>

                    <Typography type="title" color="inherit" style={{ flex: 1 }}>
                        {this.props.title}
                    </Typography>

                    <IconButton
                        color="contrast"
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
