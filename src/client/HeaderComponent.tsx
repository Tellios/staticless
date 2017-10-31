import * as React from "react";

export interface IHeaderProps {
    title: string;
    onMenuClick(): void;
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
            </div>
        );
    }
}
