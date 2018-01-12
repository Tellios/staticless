import * as React from "react";
import * as classNames from "classnames";
import * as styles from "./LoadingComponent.css";
import { CircularProgress } from "material-ui/Progress";

export class LoadingComponent extends React.Component {
    public render() {
        return (
            <div className={styles.LoadingContainer}>
                <CircularProgress />
            </div>
        );
    }
}
