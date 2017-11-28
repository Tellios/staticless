import { readJSONSync } from "fs-extra";
import * as path from "path";
import * as process from "process";
import { IConfig } from "./IConfig";
import * as nconf from "nconf";

export function loadConfig(): IConfig {
    nconf
        .argv()
        .env({ lowerCase: true, separator: "_" })
        .file("/var/config/staticless.json")
        .file("workingDirectory", path.join(process.cwd(), "staticless.json"))
        .file("appDirectory", path.join(__dirname, "staticless.json"))
        .required([
            "frontend:title",
            "gitlab:url",
            "gitlab:apiToken",
            "gitlab:projectId"
        ]);

    return {
        frontend: {
            title: nconf.get("frontend:title")
        },

        gitlab: {
            apiToken: nconf.get("gitlab:apiToken"),
            projectId: nconf.get("gitlab:projectId"),
            url: nconf.get("gitlab:url")
        }
    };
}
