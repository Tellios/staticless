import * as React from 'react';
import { connect } from 'react-redux';
import { NavComponent } from './NavComponent';
import { fetchPage, fetchMenu } from '../state/wikiActions';

export interface INavProps {
    sourceName: string | null;
    isOpen: boolean;
    menu: Staticless.GitLab.IWikiPageTreeItem[];
    loading: boolean;
    loaded: boolean;
    error: Error | null;
}

export interface INavDispatch {
    fetchPage(sourceName: string, slug: string): void;
    fetchMenu(sourceName: string): void;
}

const mapStateToProps = (storeState: Client.IState): INavProps => {
    return {
        sourceName: storeState.config.selectedSource ? storeState.config.selectedSource.name : null,
        isOpen: storeState.settings.settings.wikiMenuOpen,
        menu: storeState.wiki.menu,
        loaded: storeState.wiki.menuLoaded,
        loading: storeState.wiki.menuLoading,
        error: storeState.wiki.menuError
    };
};

const mapDispatchToProps = (dispatch: any): INavDispatch => {
    return {
        fetchPage: (sourceName, slug) => dispatch(fetchPage(sourceName, slug)),
        fetchMenu: sourceName => dispatch(fetchMenu(sourceName))
    };
};

export const NavContainer = connect(mapStateToProps, mapDispatchToProps)(
    class extends React.Component<INavProps & INavDispatch> {
        public componentDidMount() {
            if (this.props.sourceName) {
                this.props.fetchMenu(this.props.sourceName);
            }
        }

        public componentDidUpdate(oldProps: INavProps) {
            if (this.props.sourceName && this.props.sourceName !== oldProps.sourceName) {
                this.props.fetchMenu(this.props.sourceName);
            }
        }

        public render() {
            return (
                <NavComponent
                    isOpen={this.props.isOpen}
                    onNavigateToPage={this.onNavigateToPage}
                    isLoading={this.props.loading}
                    menu={this.props.menu}
                />
            );
        }

        private onNavigateToPage = (slug: string) => {
            if (this.props.sourceName) {
                this.props.fetchPage(this.props.sourceName, slug);
            }
        };
    }
);
