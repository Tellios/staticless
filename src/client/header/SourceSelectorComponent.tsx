import * as React from 'react';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { withStyles, WithStyles } from 'material-ui/styles';
import { Theme } from 'material-ui/styles/createMuiTheme';

export interface ISourceSelectorProps {
    sources: Staticless.Config.ISource[];
    selectedSource?: Staticless.Config.ISource;
    onSelectSource(e: React.ChangeEvent<HTMLSelectElement>): void;
}

const decorate = withStyles((theme: Theme) => ({
    root: {
        marginRight: theme.spacing.unit,
        color: theme.palette.common.white
    },
    select: {
        color: theme.palette.common.white
    },
    icon: {
        color: theme.palette.common.white
    }
}));

export const SourceSelectorComponent = decorate<ISourceSelectorProps>(
    class extends React.Component<
        ISourceSelectorProps & WithStyles<'root'> & WithStyles<'select'> & WithStyles<'icon'>
    > {
        public render() {
            return (
                <span>
                    <InputLabel classes={{ root: this.props.classes.root }}>
                        Selected Wiki:
                    </InputLabel>
                    <Select
                        classes={{
                            select: this.props.classes.select,
                            icon: this.props.classes.icon
                        }}
                        value={this.getSelectedSourceName()}
                        onChange={this.props.onSelectSource}
                        disableUnderline={true}
                    >
                        {this.props.sources.map((source, index) => {
                            const selected =
                                this.props.selectedSource &&
                                this.props.selectedSource.name === source.name;
                            return (
                                <MenuItem key={index} value={source.name}>
                                    {source.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </span>
            );
        }

        private getSelectedSourceName(): string {
            return this.props.selectedSource
                ? this.props.selectedSource.name
                : this.props.sources[0].name;
        }
    }
);
