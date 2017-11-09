import * as React from "react";
import * as request from "superagent";
import { Staticless } from "../models/gitlab";
import { MenuItemComponent } from "./MenuItemComponent";
import { LoadingComponent } from "./LoadingComponent";

export interface INavProps {
    onNavigateToPage: (slug: string) => void;
    isOpen: boolean;
}

export interface INavState {
    pages: Staticless.GitLab.IWikiPageTreeItem[];
    isLoading: boolean;
}

export class NavComponent extends React.Component<INavProps, INavState> {
    constructor(props: INavProps) {
        super(props);
        this.state = { pages: [], isLoading: true };
    }

    public componentDidMount() {
        request.get(`/wiki`)
            .end((err, res) => {
                if (err) {
                    return console.error(err);
                }

                this.setState({ pages: res.body, isLoading: false });
            });
    }

    public render() {
        const className = [
            "nav-container",
            this.props.isOpen ? "nav-container-open" : "nav-container-closed"
        ].join(" ");

        return (
            <nav className={className}>
                {this.props.isOpen && this.renderContent()}
            </nav>
        );
    }

    private renderContent() {
        if (this.state.isLoading) {
            return this.renderLoadingIndicator();
        } else {
            return this.renderMenuItems();
        }
    }

    private renderLoadingIndicator() {
        return <LoadingComponent />;
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
