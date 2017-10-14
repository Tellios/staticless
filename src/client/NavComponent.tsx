import * as React from "react";
import * as request from "superagent";
import { Staticless } from "../models/gitlab";
import { MenuItemComponent } from "./MenuItemComponent";

export interface INavProps {
    onNavigateToPage(slug: string): void;
}

export interface INavState {
    pages: Staticless.GitLab.IWikiPageTreeItem[];
    isOpen: boolean;
}

export class NavComponent extends React.Component<INavProps, INavState> {
    constructor(props: any) {
        super(props);
        this.state = { pages: [], isOpen: false };

        this.handleMenuIconClick = this.handleMenuIconClick.bind(this);
    }

    public componentDidMount() {
        request.get(`/wiki`)
            .end((err, res) => {
                if (err) {
                    return console.error(err);
                }

                this.setState({ pages: res.body });
            });
    }

    public render() {
        return (
            <nav className="nav-container">
                {this.state.isOpen && this.renderOpenMenu()}
                {this.state.isOpen && this.state.pages && this.renderMenuItems()}
                {!this.state.isOpen && this.renderClosedMenu()}
            </nav>
        );
    }

    private renderOpenMenu() {
        return (
            <h2 className="nav-header-open">
                <span onClick={this.handleMenuIconClick}
                    className="material-icons nav-header-icon nav-header-icon-open">
                    menu
                </span>
                Menu
            </h2>
        );
    }

    private renderClosedMenu() {
        return (
            <h2 className="nav-header-closed">
                <span
                    onClick={this.handleMenuIconClick}
                    className="material-icons nav-header-icon nav-header-icon-closed">
                    menu
                </span>
            </h2>
        );
    }

    private renderMenuItems() {
        return this.state.pages.map((page, index) => {
            return (
                <MenuItemComponent
                    key={index}
                    menuItem={page}
                    onClick={this.props.onNavigateToPage}
                />
            );
        });
    }

    private handleMenuIconClick() {
        this.setState({ ...this.state, isOpen: !this.state.isOpen });
    }
}
