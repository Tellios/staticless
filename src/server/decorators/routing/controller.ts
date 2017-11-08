export function controller(basePath: string) {
    return (target: any) => {
        target.prototype.basePath = basePath;
        return target;
    };
}
