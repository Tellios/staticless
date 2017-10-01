import { readJSONSync } from "fs-extra";
import * as path from "path";
import * as process from "process";
import { IConfig } from "./IConfig";

export function loadConfig(): IConfig {
    const configPath = path.join(process.cwd(), "config.json");
    return readJSONSync(configPath);
}
