import {
    RouteConfiguration,
    Server,
} from "hapi";
import { injectable } from "inversify";
import { IRouteConfig } from "../../decorators/routing";

@injectable()
export abstract class BaseController {
    public basePath: string;
    public rawRoutes: { [key: string]: IRouteConfig };

    public getRoutes(): IRouteConfig[] {
        return Object.entries(this.rawRoutes)
            .map((entry) => {
                return {
                    ...entry[1],
                    path: this.basePath + entry[1].path,
                } as IRouteConfig;
            });
    }
}
