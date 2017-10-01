import { addRoute } from "./addRoute";
import { IControllerObject } from "./IControllerObject";

export function get(path: string) {
    return methodDecoratorFunctionFactory("GET", path);
}

export function post(path: string) {
    return methodDecoratorFunctionFactory("POST", path);
}

function methodDecoratorFunctionFactory(method: string, path: string) {
    // tslint:disable-next-line:ban-types
    return (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>) => {
        addRoute(target as IControllerObject, key, {
            handler: descriptor.value,
            method,
            path,
        });
        return target;
    };
}
