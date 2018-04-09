import * as React from 'react';
import { connect } from 'react-redux';
import * as styles from './PageContainer.css';
import { LoadingComponent } from '../components/LoadingComponent';
import { PageComponent } from './PageComponent';
import * as mermaid from 'mermaid';

export interface IPageContainerProps {
    page: Staticless.GitLab.IWikiPage | null;
    error: Error | null;
    isLoadingPage: boolean;
}

const mapStateToProps = (state: Client.IState): IPageContainerProps => {
    return {
        page: state.wiki.page,
        error: state.wiki.pageError,
        isLoadingPage: state.wiki.pageLoading
    };
};

export const PageContainer = connect(mapStateToProps)(
    class extends React.Component<IPageContainerProps> {
        public componentDidUpdate() {
            mermaid.init();
        }

        public render() {
            return <div className={styles.WikiContent}>{this.renderContent()}</div>;
        }

        private renderContent() {
            if (this.props.error) {
                return <div>{this.props.error}</div>;
            } else if (this.props.page) {
                return (
                    <PageComponent
                        isLoading={this.props.isLoadingPage}
                        content={this.props.page.content}
                    />
                );
            } else {
                return <PageComponent isLoading={this.props.isLoadingPage} />;
            }
        }
    }
);
