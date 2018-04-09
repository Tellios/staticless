import * as React from 'react';
import * as classNames from 'classnames';
import { LoadingComponent } from '../components/LoadingComponent';
import { MenuItemComponent } from './MenuItemComponent';
import * as styles from './NavComponent.css';

export interface INavComponentProps {
    menu: Staticless.GitLab.IWikiPageTreeItem[];
    isLoading: boolean;
    isOpen: boolean;
    onNavigateToPage(slug: string): void;
}

export class NavComponent extends React.Component<INavComponentProps> {
    public render() {
        const className = classNames(styles.Container, {
            [styles.ContainerOpen]: this.props.isOpen,
            [styles.ContainerClosed]: !this.props.isOpen
        });

        return <nav className={className}>{this.props.isOpen && this.renderContent()}</nav>;
    }

    private renderContent() {
        if (this.props.isLoading) {
            return this.renderLoadingIndicator();
        } else {
            return this.renderMenuItems();
        }
    }

    private renderLoadingIndicator() {
        return <LoadingComponent />;
    }

    private renderMenuItems() {
        return this.props.menu.map((page, index) => {
            return (
                <MenuItemComponent
                    key={index}
                    menuItem={page}
                    onClick={this.props.onNavigateToPage}
                />
            );
        });
    }
}
