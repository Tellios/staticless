import { injectable } from "inversify";
import * as request from "superagent";
import { Config } from "../../../Config";

@injectable()
export class GitLabApiRepository {
    constructor(private config: Config) { }

    public async getUploadedFile(fileId: string, filename: string): Promise<any[]> {
        const config = this.config.get();
        const path = `${config.gitlab.projectPath}/uploads/${fileId}/${filename}`;

        return await this.performRequest(this.getUrl(path), (url) => request.get(url))
            .then((response) => response.body);
    }

    public async get(path: string, query?: {}): Promise<request.Response> {
        return await this.performRequest(
            this.getUrl(`api/v4/${path}`),
            (url) => request.get(url),
            query
        );
    }

    private performRequest(
        url: string,
        requestFactory: (url: string) => request.SuperAgentRequest,
        query?: {}
    ): Promise<request.Response> {
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

        return `${url}/${path}`
            // Remove any duplicate slashes due to user config input
            .replace(/\/\//g, "/")
            // Make sure that the protocol at the start of the url is correctly
            // terminated with a double slash
            .replace("/", "//");
    }
}
