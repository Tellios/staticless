import { IRouteConfig } from './IRouteConfig';

export interface IControllerObject extends Object {
    rawRoutes: { [key: string]: IRouteConfig };
}
