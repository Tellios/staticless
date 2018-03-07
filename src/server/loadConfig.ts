import { readJSONSync } from "fs-extra";
import * as path from "path";
import * as process from "process";
import { IConfig } from "./IConfig";
import * as nconf from "nconf";

export function loadConfig(): IConfig {
    nconf
        .file("workingDirectory", path.join(process.cwd(), "staticless.json"))
        .file("appDirectory", path.join(global.appRoot, "config", "staticless.json"))
        .defaults({
            server: {
                address: "0.0.0.0",
                port: 8080
            },
            cache: {
                time: 30
            }
        })
        .required([
            "frontend:title",
            "server:port",
            "server:address",
            "sources"
        ]);

    return {
        frontend: {
            title: nconf.get("frontend:title")
        },

        server: {
            address: nconf.get("server:address"),
            port: nconf.get("server:port")
        },

        sources: nconf.get("sources"),

        cache: {
            time: nconf.get("cache:time")
        }
    };
}
