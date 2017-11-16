import * as React from "react";
import { IconButtonComponent } from "./components/IconButtonComponent";

export interface IHeaderProps {
    title: string;
    onMenuClick(): void;
    onSettingsClick(): void;
}

export class HeaderComponent extends React.Component<IHeaderProps> {
    public render() {
        return (
            <div className="app-header-container">
                <h1 className="app-header">
                    <span onClick={this.props.onMenuClick}
                        className="material-icons app-header-menu-icon">
                        menu
                    </span>
                    {this.props.title}
                </h1>

                <IconButtonComponent
                    className="app-header-config-button"
                    icon="settings"
                    onClick={this.props.onSettingsClick}
                />
            </div>
        );
    }
}
