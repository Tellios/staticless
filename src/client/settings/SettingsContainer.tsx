import * as React from "react";
import { SettingsComponent } from "./SettingsComponent";
import { settingsRepository } from "./SettingsRepository";
import { themeLoader } from "./ThemeLoader";

export interface ISettingsContainerProps {
    onClose(): void;
}

export class SettingsContainer extends React.Component<ISettingsContainerProps, Client.ISettings> {
    constructor(props: ISettingsContainerProps) {
        super(props);

        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCodeThemeSelected = this.handleCodeThemeSelected.bind(this);

        this.state = settingsRepository.get();
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
        settingsRepository.set(this.state);
        themeLoader.loadTheme(this.state.codeTheme);
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
}
