import * as React from 'react';
import { ModalComponent } from '../components/ModalComponent';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { withStyles, WithStyles } from 'material-ui/styles';
import { Theme } from 'material-ui/styles/createMuiTheme';

export interface ISettingsComponentProps {
    settings: Client.ISettings;
    onCodeThemeSelected(theme: Client.CodeTheme): void;
    onSave(): void;
    onCancel(): void;
}

const decorate = withStyles((theme: Theme) => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 300
    }
}));

export const SettingsComponent = decorate<ISettingsComponentProps>(
    class extends React.Component<ISettingsComponentProps & WithStyles<'formControl'>> {
        public render() {
            return (
                <ModalComponent title="Settings" onAction={this.onAction} open={true}>
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

        private onAction = (action: 'OK' | 'Cancel') => {
            if (action === 'OK') {
                this.props.onSave();
            } else {
                this.props.onCancel();
            }
        };

        private onCodeThemeSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
            this.props.onCodeThemeSelected(e.target.value as Client.CodeTheme);
        };
    }
);
