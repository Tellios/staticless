import * as React from "react";

export class LoadingComponent extends React.Component {
    public render() {
        return (
            <div className="loading-container">
                <span>
                    <span className="material-icons loading-icon">autorenew</span>
                </span>
            </div>
        );
    }
}
