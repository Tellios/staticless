declare module '*.css' {
    interface IStyles {
        [key: string]: string;
    }

    const styles: IStyles;

    export = styles;
}
