import * as React from "react";
import { LoadingComponent } from "../components/LoadingComponent";
import { MenuItemComponent } from "./MenuItemComponent";

export interface INavComponentProps {
    pages: Staticless.GitLab.IWikiPageTreeItem[];
    isLoading: boolean;
    isOpen: boolean;
    onNavigateToPage(slug: string): void;
}

export class NavComponent extends React.Component<INavComponentProps> {
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
        return this.props.pages.map((page, index) => {
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
