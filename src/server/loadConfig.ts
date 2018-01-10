import { readJSONSync } from "fs-extra";
import * as path from "path";
import * as process from "process";
import { IConfig } from "./IConfig";
import * as nconf from "nconf";

export function loadConfig(): IConfig {
    nconf
        .argv()
        .env({ lowerCase: true, separator: "_" })
        .file("workingDirectory", path.join(process.cwd(), "staticless.json"))
        .file("appDirectory", path.join(global.appRoot, "config", "staticless.json"))
        .defaults({
            server: {
                address: "0.0.0.0",
                port: 8080
            }
        })
        .required([
            "frontend:title",
            "server:port",
            "server:address",
            "gitlab:url",
            "gitlab:apiToken",
            "gitlab:projectId"
        ]);

    return {
        frontend: {
            title: nconf.get("frontend:title")
        },

        server: {
            address: nconf.get("server:address"),
            port: nconf.get("server:port")
        },

        gitlab: {
            apiToken: nconf.get("gitlab:apiToken"),
            projectId: nconf.get("gitlab:projectId"),
            url: nconf.get("gitlab:url")
        }
    };
}
