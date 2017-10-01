import { IConfig } from "./IConfig";

export class Config {
    constructor(private settings: IConfig) { }

    public get(): IConfig {
        return this.settings;
    }
}
