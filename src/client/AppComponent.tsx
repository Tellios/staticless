import * as React from "react";
import * as request from "superagent";
import { Staticless as Config } from "../models/config";
import { HeaderComponent } from "./HeaderComponent";
import { NavComponent } from "./NavComponent";
import { PageComponent } from "./PageComponent";
import { LoadingComponent } from "./LoadingComponent";

export interface IAppComponentState {
    config?: Config.Config.Frontend;
    error?: any;
    slug?: string;
    isMenuOpen: boolean;
    isLoadingConfig: boolean;
}

export class AppComponent extends React.Component<any, IAppComponentState> {
    private readonly STORE_MENU_OPEN = "nav-menu-open";

    constructor(props: any) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleNavigateToPage = this.handleNavigateToPage.bind(this);

        const isOpenValue = localStorage[this.STORE_MENU_OPEN];
        const isOpen = isOpenValue === "true";

        this.state = { isMenuOpen: isOpen, isLoadingConfig: false };
    }

    public componentDidMount() {
        window.onpopstate = (event) => {
            this.updateStateUsingLocation();
        };

        this.fetchConfig();
        this.updateStateUsingLocation();
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
                    {this.renderContent()}
                </div>
            </div>
        );
    }

    private renderContent() {
        if (this.state.isLoadingConfig) {
            return <LoadingComponent />;
        } else if (this.state.error) {
            return <div>{this.state.error.toString()}</div>;
        } else if (this.state.slug) {
            return <PageComponent slug={this.state.slug} />;
        } else {
            return <div></div>;
        }
    }

    private handleMenuClick() {
        const isOpen = !this.state.isMenuOpen;
        localStorage.setItem(this.STORE_MENU_OPEN, String(isOpen));
        this.setState({ ...this.state, isMenuOpen: isOpen });
    }

    private handleNavigateToPage(slug: string) {
        const url = `${window.location.origin}/${slug}`;
        window.history.pushState(slug, slug, url);
        this.setState({ ...this.state, slug });
    }

    private fetchConfig() {
        request("/frontendConfig").end((err, res) => {
            if (err) {
                this.setState({ ...this.state, error: err });
                return;
            }

            this.setState({
                ...this.state,
                config: res.body
            });
        });
    }

    private updateStateUsingLocation() {
        const slug = window.location.pathname.substr(1);

        if (slug.length > 0) {
            this.setState({ ...this.state, slug });
        }
    }
}
