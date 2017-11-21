import * as React from "react";
import { LoadingComponent } from "../components/LoadingComponent";

export interface IPageComponentProps {
    isLoading: boolean;
    content?: string;
}

export class PageComponent extends React.PureComponent<IPageComponentProps> {
    public render() {
        if (this.props.isLoading) {
            return <LoadingComponent />;
        } else if (!this.props.content) {
            return <div className="wiki-container"></div>;
        }

        return (
            <div className="wiki-container">
                <div dangerouslySetInnerHTML={{ __html: this.props.content }}></div>
            </div>
        );
    }
}
