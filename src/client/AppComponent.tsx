import * as React from "react";
import * as request from "superagent";
import { NavComponent } from "./NavComponent";
import { PageComponent } from "./PageComponent";

export interface IAppComponentState {
    page: any;
    error?: any;
}

export class AppComponent extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.handleNavigateToPage = this.handleNavigateToPage.bind(this);
        this.state = {};
    }

    public componentDidMount() {
        window.onpopstate = (event) => {
            this.fetchPageUsingLocation();
        };

        this.fetchPageUsingLocation();
    }

    public render() {
        return (
            <div>
                <NavComponent onNavigateToPage={this.handleNavigateToPage} />
                {this.state.page && <PageComponent content={this.state.page.content} />}
                {this.state.error && <div>{this.state.error.toString()}</div>}
            </div>
        );
    }

    private handleNavigateToPage(slug: string) {
        const url = `${window.location.origin}/${slug}`;
        window.history.pushState(slug, slug, url);
        this.fetchPage(slug);
    }

    private fetchPageUsingLocation() {
        const slug = window.location.pathname.substr(1);

        if (slug.length > 0) {
            this.fetchPage(slug);
        }
    }

    private fetchPage(slug: string) {
        slug = encodeURIComponent(slug);

        request(`/wiki/${slug}`).end((err, res) => {
            if (err) {
                this.setState({ ...this.state, page: undefined, error: err });
                return;
            }

            const page = res.body;
            this.setState({ ...this.state, page, error: undefined });
        });
    }
}
