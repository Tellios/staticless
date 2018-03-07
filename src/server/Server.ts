import { Server as HapiServer } from 'hapi';
import { Container } from 'inversify';
import * as winston from 'winston';
import { Config } from './Config';
import { configureContainer } from './configureContainer';
import { configureRouting } from './configureRouting';
import { BaseController } from './controllers/base/BaseController';
import { IConfig } from './IConfig';
import { loadConfig } from './loadConfig';
import { Log } from './Log';

export class Server {
    public init() {
        const config = this.initializeConfig();
        const log = this.initializeLogging();

        log.debug('Initializing container');
        const container = this.initializeContainer(log, config);

        log.debug('Intializing hapi server instance');
        const hapiServer = this.intializeHapiServer(config.get());

        log.debug('Initializing routes');
        this.initializeRoutes(hapiServer, container);

        log.debug('Starting hapi server instance');
        hapiServer.start(err => {
            if (err) {
                log.error(err.toString());
                return;
            }

            if (hapiServer.info) {
                log.info(`Server running at: ${hapiServer.info.uri}`);
            } else {
                log.error('Server was started but had no info attached to it');
                process.exit(1);
            }
        });
    }

    private initializeConfig(): Config {
        const config = loadConfig();
        return new Config(config);
    }

    private initializeLogging(): Log {
        const logger = new winston.Logger({
            level: 'info',
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

    private initializeContainer(log: Log, config: Config): Container {
        const container = new Container();
        configureContainer(container, log, config);

        return container;
    }

    private intializeHapiServer(config: IConfig): HapiServer {
        const hapiServer = new HapiServer();
        hapiServer.register([require('hapi-async-handler'), require('inert')]);
        hapiServer.connection({
            address: config.server.address,
            port: config.server.port
        });

        return hapiServer;
    }

    private initializeRoutes(hapiServer: HapiServer, container: Container) {
        const controllers = container.getAll<BaseController>(BaseController);
        configureRouting(hapiServer, controllers);
    }
}
