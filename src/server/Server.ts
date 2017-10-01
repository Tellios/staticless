import { Server as HapiServer } from "hapi";
import { Container } from "inversify";
import * as winston from "winston";
import { configureContainer } from "./configureContainer";
import { configureRouting } from "./configureRouting";
import { BaseController } from "./controllers/base/BaseController";
import { Log } from "./Log";

export class Server {
    public init() {
        const log = this.initializeLogging();

        log.debug("Initializing container");
        const container = this.initializeContainer(log);

        log.debug("Intializing hapi server instance");
        const hapiServer = this.intializeHapiServer();

        log.debug("Initializing routes");
        this.initializeRoutes(hapiServer, container);

        log.debug("Starting hapi server instance");
        hapiServer.start((err) => {
            if (err) {
                log.error(err.toString());
                return;
            }

            log.info(`Server running at: ${hapiServer.info.uri}`);
        });
    }

    private initializeLogging(): Log {
        const logger = new winston.Logger({
            level: "info",
            transports: [
                new winston.transports.Console({
                    colorize: true,
                    showLevel: true,
                    timestamp: true,
                }),
            ],
        });

        return new Log(logger);
    }

    private initializeContainer(log: Log): Container {
        const container = new Container();
        configureContainer(container, log);

        return container;
    }

    private intializeHapiServer(): HapiServer {
        const hapiServer = new HapiServer();
        hapiServer.connection({
            port: 8080,
        });

        return hapiServer;
    }

    private initializeRoutes(hapiServer: HapiServer, container: Container) {
        const controllers = container.getAll<BaseController>(BaseController);
        configureRouting(hapiServer, controllers);
    }
}
