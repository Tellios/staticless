import * as React from "react";
import * as request from "superagent";
import Reboot from "material-ui/Reboot";
import * as styles from "./AppComponent.css";
import { HeaderComponent } from "./header/HeaderComponent";
import { NavContainer } from "./nav/NavContainer";
import { PageContainer } from "./page/PageContainer";
import { SettingsContainer } from "./settings/SettingsContainer";
import { LoadingComponent } from "./components/LoadingComponent";

export interface IAppComponentState {
    config?: Staticless.Config.IFrontend;
    source?: Staticless.Config.ISource;
    sources?: Staticless.Config.ISource[];
    error?: any;
    slug?: string;
    isMenuOpen: boolean;
    isSettingsOpen: boolean;
    isLoadingConfig: boolean;
}

export class AppComponent extends React.Component<any, IAppComponentState> {
    private readonly STORE_MENU_OPEN = "nav-menu-open";

    constructor(props: any) {
        super(props);

        const isOpenValue = localStorage[this.STORE_MENU_OPEN];
        const isOpen = isOpenValue === "true";

        this.state = { isMenuOpen: isOpen, isSettingsOpen: false, isLoadingConfig: false };
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
            <div className={styles.Root}>
                <Reboot />
                {
                    this.state.config
                    && <HeaderComponent
                        title={this.state.config.title}
                        sources={this.state.sources}
                        selectedSource={this.state.source}
                        onSourceSelected={this.handleSourceSelected}
                        onMenuClick={this.handleMenuClick}
                        onTitleClick={this.handleTitleClick}
                        onSettingsClick={this.handleSettingsOpen}
                    />
                }
                <div className={styles.Container}>
                    {
                        this.state.source &&
                        <NavContainer
                            sourceName={this.state.source.name}
                            onNavigateToPage={this.handleNavigateToPage}
                            isOpen={this.state.isMenuOpen}
                        />
                    }
                    {this.renderContent()}
                </div>
                {
                    this.state.isSettingsOpen
                    && <SettingsContainer onClose={this.handleSettingsClose} />
                }
            </div>
        );
    }

    private renderContent() {
        if (this.state.isLoadingConfig) {
            return <LoadingComponent />;
        } else if (this.state.error) {
            return <div>{this.state.error.toString()}</div>;
        } else if (this.state.source && this.state.slug) {
            return <PageContainer sourceName={this.state.source.name} slug={this.state.slug} />;
        } else {
            return <div></div>;
        }
    }

    private handleSourceSelected = (source: Staticless.Config.ISource) => {
        this.setState({ source }, () => {
            this.handleNavigateToPage(source.homeSlug);
        });
    }

    private handleMenuClick = () => {
        const isOpen = !this.state.isMenuOpen;
        localStorage.setItem(this.STORE_MENU_OPEN, String(isOpen));
        this.setState({ isMenuOpen: isOpen });
    }

    private handleSettingsOpen = () => {
        this.setState({ isSettingsOpen: true });
    }

    private handleSettingsClose = () => {
        this.setState({ isSettingsOpen: false });
    }

    private handleNavigateToPage = (slug: string) => {
        if (this.state.source) {
            const sourceName = encodeURIComponent(this.state.source.name);
            const url = `${window.location.origin}/${sourceName}/${slug}`;
            window.history.pushState({ sourceName, slug }, slug, url);
            this.setState({ slug });
        }
    }

    private handleTitleClick = () => {
        if (this.state.config && this.state.source && this.state.source.homeSlug) {
            this.handleNavigateToPage(this.state.source.homeSlug);
        }
    }

    private fetchConfig() {
        request("/frontendConfig").end((err, res) => {
            if (err) {
                this.setState({ error: err });
                return;
            }

            const config: Staticless.Config.IFrontend = res.body;

            this.setState({
                config
            });

            document.title = config.title;

            request("/frontendConfig/sources").end((sourcesErr, sourcesRes) => {
                if (sourcesErr) {
                    this.setState({ error: sourcesErr });
                    return;
                }

                const sources: Staticless.Config.ISource[] = sourcesRes.body;

                this.setState({
                    sources
                });

                if (sources.length > 0) {
                    if (window.location.pathname === "/") {
                        this.setState({
                            source: sources[0],
                            slug: sources[0].homeSlug
                        });
                    } else {
                        this.updateStateUsingLocation();
                    }
                }
            });
        });
    }

    private updateStateUsingLocation() {
        const path = window.location.pathname.substr(1);

        if (this.state.sources && path.length > 0) {
            const pathSplit = path.split("/");

            if (pathSplit.length > 0) {
                const source = this.state.sources.find((s) => decodeURIComponent(pathSplit[0]) === s.name);

                if (source) {
                    const slug = pathSplit.length > 1
                        ? pathSplit.slice(1).join("/")
                        : source.homeSlug;

                    this.setState({ source, slug });
                }
            }
        }
    }
}
