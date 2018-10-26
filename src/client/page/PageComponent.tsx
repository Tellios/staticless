import * as React from 'react';
import { LinearProgress } from '@material-ui/core';
import * as styles from './PageComponent.css';

export interface IPageComponentProps {
    isLoading: boolean;
    content?: string;
}

export class PageComponent extends React.PureComponent<IPageComponentProps> {
    public render() {
        if (this.props.isLoading) {
            return <LinearProgress />;
        } else if (!this.props.content) {
            return <div className={styles.WikiContainer} />;
        }

        return (
            <div className={styles.WikiContainer}>
                <div dangerouslySetInnerHTML={{ __html: this.props.content }} />
            </div>
        );
    }
}
