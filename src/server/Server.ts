import { Server as HapiServer } from 'hapi';
import * as Hapi from 'hapi';
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
    public async init() {
        const config = this.initializeConfig();
        const log = this.initializeLogging();

        log.debug('Initializing container');
        const container = this.initializeContainer(log, config);

        try {
            log.debug('Intializing hapi server instance');
            const hapiServer = await this.intializeHapiServer(config.get());

            log.debug('Initializing hapi server instance');
            await hapiServer.initialize();

            log.debug('Initializing routes');
            this.initializeRoutes(hapiServer, container);

            log.debug('Starting hapi server instance');
            await hapiServer.start();

            log.info(`Server running at: ${hapiServer.info.uri}`);
        } catch (error) {
            log.error(`Failed to start server: ${error.message}`);
            process.exit(1);
        }
    }

    private initializeConfig(): Config {
        const config = loadConfig();
        return new Config(config);
    }

    private initializeLogging(): Log {
        const { combine, colorize, padLevels, simple } = winston.format;

        const logger = winston.createLogger({
            level: 'info',
            transports: [
                new winston.transports.Console({
                    format: combine(padLevels(), simple(), colorize())
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

    private async intializeHapiServer(config: IConfig): Promise<HapiServer> {
        const hapiServer = new Hapi.Server({
            address: config.server.address,
            port: config.server.port
        });

        await hapiServer.register([/*require('hapi-async-handler'), */ require('inert')]);

        return hapiServer;
    }

    private initializeRoutes(hapiServer: HapiServer, container: Container) {
        const controllers = container.getAll<BaseController>(BaseController);
        configureRouting(hapiServer, controllers);
    }
}
