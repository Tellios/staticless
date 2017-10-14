import * as React from "react";

export interface IPageComponentProps {
    content: string;
}

export class PageComponent extends React.Component<IPageComponentProps, any> {
    public render() {
        return (
            <div className="wiki-content" dangerouslySetInnerHTML={{ __html: this.props.content }}></div>
        );
    }
}
