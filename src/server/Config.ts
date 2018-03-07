import { IConfig, ISourceConfig } from './IConfig';

export class Config {
    constructor(private settings: IConfig) {}

    public get(): IConfig {
        return this.settings;
    }

    public getSourceConfig(name: string): ISourceConfig | undefined {
        return this.settings.sources.find(source => {
            return name === source.name;
        });
    }
}
