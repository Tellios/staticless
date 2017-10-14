import {
    RouteConfiguration,
    Server as HapiServer
} from "hapi";
import { Container } from "inversify";
import * as path from "path";
import * as process from "process";
import * as url from "url";
import { BaseController } from "./controllers/base/BaseController";

export function configureRouting(hapiServer: HapiServer, controllers: BaseController[]) {
    configureClientRoutes(hapiServer);
    configureControllerRoutes(hapiServer, controllers);
}

function configureClientRoutes(hapiServer: HapiServer) {
    hapiServer.route({
        handler: {
            file: path.join(process.cwd(), "client", "index.html")
        },
        method: "GET",
        path: "/{path*}"
    });

    hapiServer.route({
        handler: {
            file: path.join(process.cwd(), "client", "app.js")
        },
        method: "GET",
        path: "/app.js"
    });

    hapiServer.route({
        handler: {
            file: path.join(process.cwd(), "client", "app.css")
        },
        method: "GET",
        path: "/app.css"
    });

    hapiServer.route({
        handler: {
            file: path.join(process.cwd(), "client", "favicon.ico")
        },
        method: "GET",
        path: "/favicon.ico"
    });
}

function configureControllerRoutes(hapiServer: HapiServer, controllers: BaseController[]) {
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
