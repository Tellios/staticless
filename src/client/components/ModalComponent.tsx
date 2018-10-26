import * as React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from '@material-ui/core';

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
