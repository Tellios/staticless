import { injectable } from 'inversify';
import { LeveledLogMethod, Logger } from 'winston';

@injectable()
export class Log {
    public readonly error: LeveledLogMethod;
    public readonly warn: LeveledLogMethod;
    public readonly info: LeveledLogMethod;
    public readonly verbose: LeveledLogMethod;
    public readonly debug: LeveledLogMethod;

    constructor(private logger: Logger) {
        this.error = logger.error;
        this.warn = logger.warn;
        this.info = logger.info;
        this.verbose = logger.verbose;
        this.debug = logger.debug;
    }
}
