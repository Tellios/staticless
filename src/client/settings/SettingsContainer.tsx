import * as React from "react";
import { SettingsComponent } from "./SettingsComponent";

export interface ISettingsContainerProps {
    onClose(): void;
}

export class SettingsContainer extends React.Component<ISettingsContainerProps, Client.ISettings> {
    private readonly STORAGE_KEY = "staticless-settings";

    private readonly defaultSettings: Client.ISettings = {
        codeTheme: "dark"
    };

    constructor(props: ISettingsContainerProps) {
        super();

        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCodeThemeSelected = this.handleCodeThemeSelected.bind(this);

        this.state = this.getSettings();
    }

    public render() {
        return (
            <SettingsComponent
                onSave={this.handleSave}
                onCancel={this.handleCancel}
                settings={this.state}
                onCodeThemeSelected={this.handleCodeThemeSelected}
            />
        );
    }

    private handleSave() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
        this.props.onClose();
    }

    private handleCancel() {
        this.props.onClose();
    }

    private handleCodeThemeSelected(value: Client.CodeTheme) {
        this.setState((prevState): Client.ISettings => {
            return {
                codeTheme: value
            };
        });
    }

    private getSettings() {
        const settings = localStorage.getItem(this.STORAGE_KEY) as string | null;

        if (settings == null) {
            return { ...this.defaultSettings };
        }

        return JSON.parse(settings) as Client.ISettings;
    }
}
