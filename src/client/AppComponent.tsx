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
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleSettingsOpen = this.handleSettingsOpen.bind(this);
        this.handleSettingsClose = this.handleSettingsClose.bind(this);
        this.handleNavigateToPage = this.handleNavigateToPage.bind(this);

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
                            onMenuClick={this.handleMenuClick}
                            onSettingsClick={this.handleSettingsOpen}
                        />
                }
                <div className={styles.Container}>
                    <NavContainer onNavigateToPage={this.handleNavigateToPage} isOpen={this.state.isMenuOpen} />
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
        } else if (this.state.slug) {
            return <PageContainer slug={this.state.slug} />;
        } else {
            return <div></div>;
        }
    }

    private handleMenuClick() {
        const isOpen = !this.state.isMenuOpen;
        localStorage.setItem(this.STORE_MENU_OPEN, String(isOpen));
        this.setState({ isMenuOpen: isOpen });
    }

    private handleSettingsOpen() {
        this.setState({ isSettingsOpen: true });
    }

    private handleSettingsClose() {
        this.setState({ isSettingsOpen: false });
    }

    private handleNavigateToPage(slug: string) {
        const url = `${window.location.origin}/${slug}`;
        window.history.pushState(slug, slug, url);
        this.setState({ slug });
    }

    private fetchConfig() {
        request("/frontendConfig").end((err, res) => {
            if (err) {
                this.setState({ error: err });
                return;
            }

            this.setState({
                config: res.body
            });
        });
    }

    private updateStateUsingLocation() {
        const slug = window.location.pathname.substr(1);

        if (slug.length > 0) {
            this.setState({ slug });
        }
    }
}
