import * as React from 'react';
import { SettingsComponent } from './SettingsComponent';
import { settingsRepository } from './SettingsRepository';
import { themeLoader } from './ThemeLoader';
import { connect } from 'react-redux';
import { settingsClose, settingsSet, settingsGet } from '../state/settingsActions';

export interface ISettingsContainerProps {
    settings: Client.ISettings;
}

export interface ISettingsContainerDispatch {
    onClose(): void;
    save(settings: Client.ISettings): void;
}

const mapStateToProps = (state: Client.IState): ISettingsContainerProps => ({
    settings: state.settings.settings
});

const mapDispatchToProps = (dispatch: any): ISettingsContainerDispatch => ({
    onClose: () => dispatch(settingsClose()),
    save: settings => dispatch(settingsSet(settings))
});

export const SettingsContainer = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<ISettingsContainerProps & ISettingsContainerDispatch> {
        public render() {
            return (
                <SettingsComponent
                    onClose={this.handleClose}
                    settings={this.props.settings}
                    onCodeThemeSelected={this.handleCodeThemeSelected}
                />
            );
        }

        private handleClose = () => {
            this.props.onClose();
        };

        private handleCodeThemeSelected = (value: Client.CodeTheme) => {
            this.props.save({
                ...this.props.settings,
                codeTheme: value
            });
            themeLoader.loadTheme(value);
        };
    }
);
