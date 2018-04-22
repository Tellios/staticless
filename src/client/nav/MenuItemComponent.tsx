import * as React from 'react';
import * as classNames from 'classnames';
import * as styles from './MenuItemComponent.css';

export interface IMenuItemProps {
    menuItem: Staticless.GitLab.IWikiPageTreeItem;
    parentSlug?: string;
    onClick: (slug: string) => void;
}

export interface IMenuItemState {
    isOpen: boolean;
}

export class MenuItemComponent extends React.Component<IMenuItemProps, IMenuItemState> {
    constructor(props: IMenuItemProps) {
        super(props);
        this.state = { isOpen: this.shouldBeOpen(props.menuItem) };
    }

    public render(): any {
        const labelClassName = classNames(styles.MenuItemLabelText, {
            [styles.MenuItemLabelTextSelected]: this.isSelected(this.props.menuItem)
        });

        return (
            <div className={styles.MenuItem}>
                <div className={styles.MenuItemLabel}>
                    {this.props.menuItem.children.length > 0 && (
                        <span
                            className={classNames('material-icons', styles.MenuItemIcon)}
                            onClick={this.handleFolderClick}
                        >
                            {this.getIcon()}
                        </span>
                    )}

                    <span className={labelClassName} onClick={this.handleMenuItemClick}>
                        {this.props.menuItem.title}
                    </span>
                </div>

                {this.props.menuItem.children.length > 0 &&
                    this.state.isOpen &&
                    this.renderChildren()}
            </div>
        );
    }

    private renderChildren() {
        return (
            <div className={styles.MenuItemChildren}>
                {this.props.menuItem.children.map(
                    (child: Staticless.GitLab.IWikiPageTreeItem, index: number) => {
                        const key = `${index}-${child.slugPart}`;
                        return (
                            <div className={styles.MenuItemChild} key={key}>
                                <MenuItemComponent
                                    menuItem={child}
                                    parentSlug={this.getSlug()}
                                    onClick={this.props.onClick}
                                />
                            </div>
                        );
                    }
                )}
            </div>
        );
    }

    private getSlug() {
        if (this.props.parentSlug) {
            return `${this.props.parentSlug}/${this.props.menuItem.slugPart}`;
        }

        return this.props.menuItem.slugPart;
    }

    private getIcon() {
        return this.state.isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right';
    }

    private handleMenuItemClick = () => {
        if (this.props.menuItem.page) {
            this.props.onClick(this.props.menuItem.page.slug);
        }

        if (this.props.menuItem.children.length > 0) {
            this.handleFolderClick();
        }
    };

    private handleFolderClick = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    private shouldBeOpen(menuItem: Staticless.GitLab.IWikiPageTreeItem) {
        const slugPath = this.getWindowSlugPath();

        if (slugPath && menuItem.children.length > 0) {
            return slugPath.startsWith(this.getSlug());
        }

        return false;
    }

    private isSelected(menuItem: Staticless.GitLab.IWikiPageTreeItem) {
        const slugPath = this.getWindowSlugPath();
        return menuItem.page && menuItem.page.slug === slugPath;
    }

    private getWindowSlugPath() {
        if (window.location.pathname && window.location.pathname.length > 0) {
            return window.location.pathname
                .split('/')
                .slice(2)
                .join('/');
        } else {
            return undefined;
        }
    }
}
