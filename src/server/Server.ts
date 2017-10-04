import { Server as HapiServer } from "hapi";
import { Container } from "inversify";
import * as winston from "winston";
import { Config } from "./Config";
import { configureContainer } from "./configureContainer";
import { configureRouting } from "./configureRouting";
import { BaseController } from "./controllers/base/BaseController";
import { IConfig } from "./IConfig";
import { loadConfig } from "./loadConfig";
import { Log } from "./Log";

export class Server {
    public init() {
        const settings = this.initializeConfig();
        const log = this.initializeLogging();

        log.debug("Initializing container");
        const container = this.initializeContainer(log, settings);

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

    private initializeConfig(): Config {
        const config = loadConfig();
        return new Config(config);
    }

    private initializeLogging(): Log {
        const logger = new winston.Logger({
            level: "info",
            transports: [
                new winston.transports.Console({
                    colorize: true,
                    showLevel: true,
                    timestamp: true
                })
            ]
        });

        return new Log(logger);
    }

    private initializeContainer(log: Log, settings: Config): Container {
        const container = new Container();
        configureContainer(container, log, settings);

        return container;
    }

    private intializeHapiServer(): HapiServer {
        const hapiServer = new HapiServer();
        hapiServer.register([
            require("hapi-async-handler"),
            require("inert")
        ]);
        hapiServer.connection({
            port: 8080
        });

        return hapiServer;
    }

    private initializeRoutes(hapiServer: HapiServer, container: Container) {
        const controllers = container.getAll<BaseController>(BaseController);
        configureRouting(hapiServer, controllers);
    }
}
