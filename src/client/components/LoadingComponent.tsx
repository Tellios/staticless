import * as React from "react";
import * as classNames from "classnames";
import * as styles from "./LoadingComponent.css";

export class LoadingComponent extends React.Component {
    public render() {
        return (
            <div className={styles.LoadingContainer}>
                <span>
                    <span className={classNames("material-icons", styles.LoadingIcon)}>autorenew</span>
                </span>
            </div>
        );
    }
}
