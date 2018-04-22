import { RouteConfiguration, Server } from 'hapi';
import { injectable } from 'inversify';
import { IRouteConfig } from '../../decorators/routing';

@injectable()
export abstract class BaseController {
    public basePath: string;
    public rawRoutes: { [key: string]: IRouteConfig };

    public getRoutes(): IRouteConfig[] {
        return Object.entries(this.rawRoutes).map(entry => {
            let routePath = this.basePath;

            if (entry[1].path !== '/') {
                routePath += entry[1].path;
            }

            return {
                ...entry[1],
                path: routePath
            } as IRouteConfig;
        });
    }
}
