import * as React from "react";
import * as classNames from "classnames";
import * as styles from "./IconButtonComponent.css";

export interface IIconButtonComponent {
    icon: string;
    className?: string;
    iconClassName?: string;
    onClick(): void;
}

export class IconButtonComponent extends React.Component<IIconButtonComponent> {
    constructor(props: IIconButtonComponent) {
        super(props);
    }

    public render() {
        const className = classNames(this.props.className, styles.IconButtonComponent);
        const iconClassName = classNames("material-icons", this.props.iconClassName);

        return (
            <span className={className} onClick={this.props.onClick}>
                <span className={iconClassName}>{this.props.icon}</span>
            </span>
        );
    }
}
