import * as React from "react";
import { ModalComponent } from "../components/ModalComponent";

export interface ISettingsComponentProps {
    settings: Client.ISettings;
    onCodeThemeSelected(theme: Client.CodeTheme): void;
    onSave(): void;
    onCancel(): void;
}

export class SettingsComponent extends React.Component<ISettingsComponentProps> {
    constructor(props: ISettingsComponentProps) {
        super(props);

        this.onAction = this.onAction.bind(this);
    }

    public render() {
        return (
            <ModalComponent title="Settings" onAction={this.onAction}>
                <div>
                    <div>
                        <label className="form-label">Code theme</label>
                        <select
                            value={this.props.settings.codeTheme}
                            className="form-input"
                            onChange={(e) => this.props.onCodeThemeSelected(e.target.value as Client.CodeTheme)}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
            </ModalComponent>
        );
    }

    private onAction(action: "OK" | "Cancel") {
        if (action === "OK") {
            this.props.onSave();
        } else {
            this.props.onCancel();
        }
    }
}
