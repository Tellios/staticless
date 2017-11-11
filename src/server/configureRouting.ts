import {
    RouteConfiguration,
    Server as HapiServer
} from "hapi";
import { Container } from "inversify";
import * as path from "path";
import * as process from "process";
import { readdirSync } from "fs-extra";
import * as url from "url";
import { BaseController } from "./controllers/base/BaseController";

export function configureRouting(hapiServer: HapiServer, controllers: BaseController[]) {
    configureClientRoutes(hapiServer);
    configureControllerRoutes(hapiServer, controllers);
}

function configureClientRoutes(hapiServer: HapiServer) {
    const clientFiles = readdirSync(path.join(process.cwd(), "client"));

    hapiServer.route(getFileRoutes(clientFiles));
    hapiServer.route(getFallbackRoute());
}

function getFileRoutes(files: string[]): RouteConfiguration[] {
    return files
        .filter((file: string) => !file.endsWith("index.html"))
        .map((file: string): RouteConfiguration => {
            return {
                handler: {
                    file: path.join(process.cwd(), "client", file)
                },
                method: "GET",
                path: `/${file}`
            };
        });
}

function getFallbackRoute(): RouteConfiguration {
    return {
        handler: {
            file: path.join(process.cwd(), "client", "index.html")
        },
        method: "GET",
        path: "/{path*}"
    };
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
