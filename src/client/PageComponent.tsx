import * as React from "react";
import * as request from "superagent";
import { Staticless as GitLab } from "../models/gitlab";
import { LoadingComponent } from "./LoadingComponent";

export interface IPageComponentProps {
    slug: string;
}

export interface IPageComponentState {
    page?: GitLab.GitLab.IWikiPage;
    error?: any;
    isLoadingPage: boolean;
}

export class PageComponent extends React.Component<IPageComponentProps, IPageComponentState> {
    constructor(props: IPageComponentProps) {
        super(props);
        this.state = { isLoadingPage: false };
    }

    public componentDidMount() {
        this.fetchPage(this.props.slug);
    }

    public componentDidUpdate(oldProps: IPageComponentProps) {
        if (this.props.slug !== oldProps.slug) {
            this.fetchPage(this.props.slug);
        }
    }

    public render() {
        return (
            <div className="wiki-content">
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        if (this.state.isLoadingPage) {
            return <LoadingComponent />;
        } else if (this.state.error) {
            return <div>{this.state.error}</div>;
        } else if (this.state.page) {
            return <div dangerouslySetInnerHTML={{ __html: this.state.page.content }}></div>;
        } else {
            return <div></div>;
        }
    }

    private fetchPage(slug: string) {
        this.setState({ ...this.state, isLoadingPage: true });

        slug = encodeURIComponent(slug);

        request(`/wiki/${slug}`).end((err, res) => {
            if (err) {
                this.setState({ ...this.state, page: undefined, error: err, isLoadingPage: false });
                return;
            }

            const page = res.body;
            this.setState({ ...this.state, page, error: undefined, isLoadingPage: false });
        });
    }
}
