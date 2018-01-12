import * as React from "react";
import * as classNames from "classnames";
import * as styles from "./HeaderComponent.css";
import { IconButtonComponent } from "../components/IconButtonComponent";

export interface IHeaderProps {
    title: string;
    onMenuClick(): void;
    onSettingsClick(): void;
}

export class HeaderComponent extends React.Component<IHeaderProps> {
    public render() {
        return (
            <div className={styles.AppHeaderContainer}>
                <h1 className={styles.AppHeader}>
                    <span onClick={this.props.onMenuClick}
                        className={classNames("material-icons", styles.AppHeaderMenuIcon)}>
                        menu
                    </span>
                    {this.props.title}
                </h1>

                <IconButtonComponent
                    className={styles.AppHeaderConfigButton}
                    icon="settings"
                    tooltip="Settings"
                    onClick={this.props.onSettingsClick}
                />
            </div>
        );
    }
}
