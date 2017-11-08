import * as React from "react";
import * as request from "superagent";
import { Staticless } from "../models/gitlab";
import { MenuItemComponent } from "./MenuItemComponent";

export interface INavProps {
    onNavigateToPage: (slug: string) => void;
    isOpen: boolean;
}

export interface INavState {
    pages: Staticless.GitLab.IWikiPageTreeItem[];
}

export class NavComponent extends React.Component<INavProps, INavState> {
    constructor(props: INavProps) {
        super(props);
        this.state = { pages: [] };
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
        const className = [
            "nav-container",
            this.props.isOpen ? "nav-container-open" : "nav-container-closed"
        ].join(" ");

        return (
            <nav className={className}>
                {this.props.isOpen && this.state.pages && this.renderMenuItems()}
            </nav>
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
}
