import * as React from "react";

export interface INavComponentProps {
    onNavigateToPage(slug: string): void;
}

export class NavComponent extends React.Component<INavComponentProps, any> {
    public render() {
        return (
            <nav>
                <button onClick={() => this.props.onNavigateToPage("home")}>Home</button>
                <button onClick={() => this.props.onNavigateToPage("relative-url-to-child-page")}>relative</button>
            </nav>
        );
    }
}
