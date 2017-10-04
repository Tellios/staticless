import * as React from "react";
import * as request from "superagent";

export interface INavComponentProps {
    onNavigateToPage(slug: string): void;
}

export interface INavComponentState {
    pages: any[];
}

export class NavComponent extends React.Component<INavComponentProps, INavComponentState> {
    constructor(props) {
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
        return (
            <nav>
                {this.state.pages && this.renderMenu()}
            </nav>
        );
    }

    private renderMenu() {
        return this.state.pages.map((page, index) => {
            return (
                <button key={index} onClick={() => this.props.onNavigateToPage(page.slug)}>{page.title}</button>
            );
        });
    }
}
