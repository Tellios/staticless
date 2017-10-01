export function controller(basePath: string) {
    return (target) => {
        target.prototype.basePath = basePath;
        return target;
    };
}
