import * as React from 'react';
import * as classNames from 'classnames';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import { KeyboardEvent } from 'react';
import { Theme } from 'material-ui/styles/createMuiTheme';

export interface IModalComponentProps {
    title: string;
    open: boolean;
    onAction(action: 'OK' | 'Cancel'): void;
}

export class ModalComponent extends React.Component<IModalComponentProps> {
    public render() {
        return (
            <Dialog open={this.props.open} onEscapeKeyDown={this.onCancel}>
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent>{this.props.children}</DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.onCancel}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={this.onSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    private onSave = () => {
        this.props.onAction('OK');
    };

    private onCancel = () => {
        this.props.onAction('Cancel');
    };

    private onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'escape') {
            this.props.onAction('Cancel');
        }
    };
}
