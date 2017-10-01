import { addRoute } from "./addRoute";
import { IControllerObject } from "./IControllerObject";

export function get(path: string) {
    // tslint:disable-next-line:ban-types
    return (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) => {
        addRoute(target as IControllerObject, key, {
            handler: descriptor.value,
            method: "GET",
            path,
        });
        return target;
    };
}
