import { Staticless } from "../models/config";

export interface IConfig {
    frontend: Staticless.Config.Frontend;

    gitlab: {
        url: string;
        apiToken: string;
        projectId: string;
    };
}
