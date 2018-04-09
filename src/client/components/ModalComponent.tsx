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
    onClose(): void;
}

export class ModalComponent extends React.Component<IModalComponentProps> {
    public render() {
        return (
            <Dialog open={this.props.open} onEscapeKeyDown={this.props.onClose}>
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent>{this.props.children}</DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={this.props.onClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
