import {
    RouteConfiguration,
    Server as HapiServer
} from "hapi";
import { Container } from "inversify";
import * as path from "path";
import * as process from "process";
import { readdirSync } from "fs-extra";
import * as klaw from "klaw-sync";
import * as url from "url";
import { BaseController } from "./controllers/base/BaseController";

export function configureRouting(hapiServer: HapiServer, controllers: BaseController[]) {
    configureClientRoutes(hapiServer);
    configureControllerRoutes(hapiServer, controllers);
}

function configureClientRoutes(hapiServer: HapiServer) {
    const clientDir = path.join(global.appRoot, "client");
    const clientFiles = klaw(clientDir, { nodir: true })
        .map((file) => file.path);

    hapiServer.route(getFileRoutes(clientDir, clientFiles));
    hapiServer.route(getFallbackRoute(clientDir));
}

function getFileRoutes(clientDir: string, files: string[]): RouteConfiguration[] {
    return files
        .filter((file: string) => !file.endsWith("index.html"))
        .map((file: string): RouteConfiguration => {
            const fileWebPath =
                file.substring(clientDir.length)
                .replace(/\\/g, "/");

            return {
                handler: {
                    file
                },
                method: "GET",
                path: fileWebPath
            };
        });
}

function getFallbackRoute(clientDir: string): RouteConfiguration {
    return {
        handler: {
            file: path.join(clientDir, "index.html")
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
