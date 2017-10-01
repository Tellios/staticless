import { IControllerObject } from "./IControllerObject";
import { IRouteConfig } from "./IRouteConfig";

export function addRoute(target: IControllerObject, key: string, config: IRouteConfig) {
    const routeId = `${target.constructor.name}.${key}`;

    if (!target.rawRoutes) {
        target.rawRoutes = {};
    }

    if (typeof target.rawRoutes[routeId] !== "undefined") {
        throw new Error(`Route for '${routeId}' has already been added`);
    }

    target.rawRoutes[routeId] = config;
}
