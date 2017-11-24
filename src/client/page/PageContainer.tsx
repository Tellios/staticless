import * as React from "react";
import * as request from "superagent";
import * as styles from "./PageContainer.css";
import { LoadingComponent } from "../components/LoadingComponent";
import { PageComponent } from "./PageComponent";

export interface IPageContainerProps {
    slug: string;
}

export interface IPageComponentState {
    page?: Staticless.GitLab.IWikiPage;
    error?: any;
    isLoadingPage: boolean;
}

export class PageContainer extends React.Component<IPageContainerProps, IPageComponentState> {
    constructor(props: IPageContainerProps) {
        super(props);
        this.state = { isLoadingPage: false };
    }

    public componentDidMount() {
        this.fetchPage(this.props.slug);
    }

    public componentDidUpdate(oldProps: IPageContainerProps) {
        if (this.props.slug !== oldProps.slug) {
            this.fetchPage(this.props.slug);
        }
    }

    public render() {
        return (
            <div className={styles.WikiContent}>
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.page) {
            return <PageComponent isLoading={this.state.isLoadingPage} content={this.state.page.content} />;
        } else {
            return <PageComponent isLoading={this.state.isLoadingPage} />;
        }
    }

    private fetchPage(slug: string) {
        this.setState({ isLoadingPage: true });

        slug = encodeURIComponent(slug);

        request(`/wiki/${slug}`).end((err, res) => {
            if (err) {
                this.setState({ page: undefined, error: err, isLoadingPage: false });
                return;
            }

            const page = res.body;
            this.setState({ page, error: undefined, isLoadingPage: false });
        });
    }
}
