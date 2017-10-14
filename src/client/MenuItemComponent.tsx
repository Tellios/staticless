import * as React from "react";
import { Staticless } from "../models/gitlab";

export interface IMenuItemProps {
    menuItem: Staticless.GitLab.IWikiPageTreeItem;
    onClick: (slug: string) => void;
}

export interface IMenuItemState {
    isOpen: boolean;
}

export class MenuItemComponent extends React.Component<IMenuItemProps, IMenuItemState> {
    constructor(props: IMenuItemProps) {
        super(props);
        this.state = { isOpen: false };

        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleFolderClick = this.handleFolderClick.bind(this);
    }

    public render(): any {
        return (
            <div className="menu-item">
                <div className="menu-item-label">
                    {this.props.menuItem.children.length > 0
                        && <span
                            className="material-icons menu-item-icon"
                            onClick={this.handleFolderClick}>{this.getIcon()}
                        </span>}

                    <span
                        className="menu-item-label-text"
                        onClick={this.handleMenuItemClick}>
                        {this.props.menuItem.title}
                    </span>
                </div>

                {this.props.menuItem.children.length > 0 && this.state.isOpen && this.renderChildren()}
            </div>
        );
    }

    private renderChildren() {
        return (
            <div className="menu-item-children">
                {
                    this.props.menuItem.children.map((child, index) => {
                        const key = `${index}-${child.slugPart}`;
                        return (
                            <div className="menu-item-child" key={key}>
                                <MenuItemComponent menuItem={child} onClick={this.props.onClick} />
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    private getIcon() {
        return this.state.isOpen ? "keyboard_arrow_down" : "keyboard_arrow_right";
    }

    private handleMenuItemClick() {
        if (this.props.menuItem.page) {
            this.props.onClick(this.props.menuItem.page.slug);
        } else if (this.props.menuItem.children.length > 0) {
            this.handleFolderClick();
        }
    }

    private handleFolderClick() {
        this.setState({ isOpen: !this.state.isOpen });
    }
}
