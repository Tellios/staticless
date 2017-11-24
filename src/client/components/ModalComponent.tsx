import * as React from "react";
import * as classNames from "classnames";
import * as styles from "./ModalComponent.css";
import { IconButtonComponent } from "./IconButtonComponent";
import { KeyboardEvent } from "react";

export interface IModalComponentProps {
    title: string;
    onAction(action: "OK" | "Cancel"): void;
}

export class ModalComponent extends React.Component<IModalComponentProps> {
    constructor(props: IModalComponentProps) {
        super();

        this.onKeyDown = this.onKeyDown.bind(this);
    }

    public render() {
        return (
            <div className={styles.Container} onKeyDown={this.onKeyDown}>
                <div className={styles.Modal}>
                    <div className={styles.Header}>
                        {this.props.title}
                    </div>
                    <div className={styles.Content}>{this.props.children}</div>
                    <div className={styles.ButtonRow}>
                        <IconButtonComponent
                            iconClassName={classNames(styles.Button, styles.OkButton)}
                            icon="check_circle"
                            onClick={() => this.props.onAction("OK")}
                        />
                        <IconButtonComponent
                            iconClassName={classNames(styles.Button, styles.CancelButton)}
                            icon="cancel"
                            onClick={() => this.props.onAction("Cancel")}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "escape") {
            this.props.onAction("Cancel");
        }
    }
}
