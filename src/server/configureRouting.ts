import {
    RouteConfiguration,
    Server as HapiServer
} from "hapi";
import { Container } from "inversify";
import { BaseController } from "./controllers/base/BaseController";

export function configureRouting(hapiServer: HapiServer, controllers: BaseController[]) {
    for (const controller of controllers) {
        const routes = controller.getRoutes();

        const hapiRoutes = routes.map((route) => {
            route.handler = route.handler.bind(controller);

            return {
                ...route
            } as RouteConfiguration;
        });

        hapiServer.route(hapiRoutes);
    }
}
