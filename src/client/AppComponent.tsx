import * as React from "react";
import * as request from "superagent";
import { NavComponent } from "./NavComponent";
import { PageComponent } from "./PageComponent";

export interface IAppComponentState {
    page: any;
}

export class AppComponent extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.handleNavigateToPage = this.handleNavigateToPage.bind(this);
        this.state = {};
    }

    public componentDidMount() {
        const slug = window.location.pathname.substr(1);

        if (slug.length > 0) {
            this.fetchPage(slug);
        }
    }

    public render() {
        return (
            <div>
                <NavComponent onNavigateToPage={this.handleNavigateToPage} />
                {this.state.page && <PageComponent content={this.state.page.content} />}
            </div>
        );
    }

    private handleNavigateToPage(slug: string) {
        const url = `${window.location.origin}/${encodeURIComponent(slug)}`;
        window.history.pushState(slug, slug, url);
        this.fetchPage(slug);
    }

    private fetchPage(slug: string) {
        /*slug = slug.replace(/\//g, ":::");*/
        slug = encodeURIComponent(slug);

        request(`/wiki/${slug}`).end((err, res) => {
            if (err) {
                console.error(err);
                return;
            }

            const page = res.body;
            this.setState({ ...this.state, page });
        });
    }
}
