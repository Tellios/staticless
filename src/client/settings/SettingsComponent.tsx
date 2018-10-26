import * as React from 'react';
import { ModalComponent } from '../components/ModalComponent';
import {
    Input,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    withStyles,
    WithStyles,
    Theme
} from '@material-ui/core';

export interface ISettingsComponentProps {
    settings: Client.ISettings;
    onCodeThemeSelected(theme: Client.CodeTheme): void;
    onClose(): void;
}

const decorate = withStyles((theme: Theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 300
    }
}));

export const SettingsComponent = decorate(
    class extends React.Component<ISettingsComponentProps & WithStyles<'formControl'>> {
        public render() {
            return (
                <ModalComponent title="Settings" onClose={this.props.onClose} open={true}>
                    <FormControl className={this.props.classes.formControl}>
                        <InputLabel htmlFor="code-theme">Code theme</InputLabel>
                        <Select
                            input={<Input name="codeTheme" id="code-theme" />}
                            value={this.props.settings.codeTheme}
                            onChange={this.onCodeThemeSelected}
                        >
                            <MenuItem value="atom-one-dark">Atom One Dark</MenuItem>
                            <MenuItem value="atom-one-light">Atom One Light</MenuItem>
                            <MenuItem value="monokai">Monokai</MenuItem>
                            <MenuItem value="solarized-dark">Solarized Dark</MenuItem>
                            <MenuItem value="solarized-light">Solarized Light</MenuItem>
                            <MenuItem value="tomorrow">Tomorrow</MenuItem>
                        </Select>
                    </FormControl>
                </ModalComponent>
            );
        }

        private onCodeThemeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
            this.props.onCodeThemeSelected(e.target.value as Client.CodeTheme);
        };
    }
);
