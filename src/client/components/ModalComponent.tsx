import * as React from "react";
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
            <div className="modal-container" onKeyDown={this.onKeyDown}>
                <div className="modal">
                    <div className="modal-header">
                        {this.props.title}
                    </div>
                    <div className="modal-content">{this.props.children}</div>
                    <div className="modal-button-row">
                        <IconButtonComponent
                            iconClassName="modal-button modal-ok-button"
                            icon="check_circle"
                            onClick={() => this.props.onAction("OK")}
                        />
                        <IconButtonComponent
                            iconClassName="modal-button modal-cancel-button"
                            icon="cancel"
                            onClick={() => this.props.onAction("Cancel")}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        console.log(e);
        if (e.key === "escape") {
            this.props.onAction("Cancel");
        }
    }
}
