import * as React from 'react';
import * as styles from './LoadingComponent.css';
import { CircularProgress } from '@material-ui/core';

export class LoadingComponent extends React.Component {
    public render() {
        return (
            <div className={styles.LoadingContainer}>
                <CircularProgress />
            </div>
        );
    }
}
