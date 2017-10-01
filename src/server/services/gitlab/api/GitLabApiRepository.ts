import { injectable } from "inversify";
import * as request from "superagent";
import { Config } from "../../../Config";

@injectable()
export class GitLabApiRepository {
    constructor(private config: Config) { }

    public async get(path: string, query?: {}): Promise<request.Response> {
        return await this.performRequest(
            path,
            (url) => request.get(url),
            query
        );
    }

    private performRequest(
        path: string,
        requestFactory: (url: string) => request.SuperAgentRequest,
        query?: {}
    ): Promise<request.Response> {
        const url = this.getUrl(path);
        const req = requestFactory(url)
            .set("PRIVATE-TOKEN", this.config.get().gitlab.apiToken)
            .accept("application/json");

        if (query) {
            req.query(query);
        }

        return req;
    }

    private getUrl(path: string) {
        const url = this.config.get().gitlab.url;

        const u = `${url}/api/v4/${path}`
            // Remove any duplicate slashes due to user config input
            .replace(/\/\//g, "/")
            // Make sure that the protocol at the start of the url is correctly
            // terminated with a double slash
            .replace("/", "//");

        return u;
    }
}
