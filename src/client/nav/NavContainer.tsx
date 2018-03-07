import * as React from "react";
import * as request from "superagent";
import { NavComponent } from "./NavComponent";

export interface INavProps {
    onNavigateToPage: (slug: string) => void;
    sourceName: string;
    isOpen: boolean;
}

export interface INavState {
    pages: Staticless.GitLab.IWikiPageTreeItem[];
    isLoading: boolean;
}

export class NavContainer extends React.Component<INavProps, INavState> {
    constructor(props: INavProps) {
        super(props);
        this.state = { pages: [], isLoading: true };
    }

    public componentDidMount() {
        request.get(`/wiki/${this.props.sourceName}`)
            .end((err, res) => {
                if (err) {
                    return console.error(err);
                }

                this.setState({ pages: res.body, isLoading: false });
            });
    }

    public render() {
        return (
            <NavComponent
                isOpen={this.props.isOpen}
                onNavigateToPage={this.props.onNavigateToPage}
                isLoading={this.state.isLoading}
                pages={this.state.pages}
            />
        );
    }
}
