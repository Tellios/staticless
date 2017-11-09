import * as React from "react";
import { LoadingComponent } from "../LoadingComponent";

export interface IPageComponentProps {
    isLoading: boolean;
    content?: string;
}

export const PageComponent = (props: IPageComponentProps) => {
    if (props.isLoading) {
        return <LoadingComponent />;
    } else if (!props.content) {
        return <div className="wiki-container"></div>;
    }

    return (
        <div className="wiki-container">
            <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
        </div>
    );
};
