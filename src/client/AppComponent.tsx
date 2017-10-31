import * as React from "react";
import * as request from "superagent";
import { Staticless as Config } from "../models/config";
import { Staticless as GitLab } from "../models/gitlab";
import { HeaderComponent } from "./HeaderComponent";
import { NavComponent } from "./NavComponent";
import { PageComponent } from "./PageComponent";

export interface IAppComponentState {
    page?: GitLab.GitLab.IWikiPage;
    config?: Config.Config.Frontend;
    error?: any;
    isMenuOpen: boolean;
}

export class AppComponent extends React.Component<any, IAppComponentState> {
    constructor(props: any) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleNavigateToPage = this.handleNavigateToPage.bind(this);
        this.state = { isMenuOpen: false };
    }

    public componentDidMount() {
        window.onpopstate = (event) => {
            this.fetchPageUsingLocation();
        };

        this.fetchConfig();
        this.fetchPageUsingLocation();
    }

    public render() {
        return (
            <div className="app-root">
                {
                    this.state.config
                    && <HeaderComponent title={this.state.config.title} onMenuClick={this.handleMenuClick} />
                }
                <div className="app-container">
                    <NavComponent onNavigateToPage={this.handleNavigateToPage} isOpen={this.state.isMenuOpen} />
                    {this.state.page && <PageComponent content={this.state.page.content} />}
                    {this.state.error && <div>{this.state.error.toString()}</div>}
                </div>
            </div>
        );
    }

    private handleMenuClick() {
        this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
    }

    private handleNavigateToPage(slug: string) {
        const url = `${window.location.origin}/${slug}`;
        window.history.pushState(slug, slug, url);
        this.fetchPage(slug);
    }

    private fetchConfig() {
        request("/frontendConfig").end((err, res) => {
            if (err) {
                this.setState({ ...this.state, page: undefined, error: err });
                return;
            }

            this.setState({
                ...this.state,
                config: res.body
            });
        });
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
