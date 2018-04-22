import { injectable } from 'inversify';
import * as request from 'superagent';
import { ISourceConfig } from '../../../IConfig';

@injectable()
export class GitLabApiRepository {
    public async getUploadedFile(
        sourceConfig: ISourceConfig,
        projectPath: string,
        fileId: string,
        filename: string
    ): Promise<any[]> {
        const path = `${projectPath}/uploads/${fileId}/${filename}`;

        return await this.performRequest(
            this.getUrl(sourceConfig.url, path),
            sourceConfig.apitoken,
            url => request.get(url)
        ).then(response => response.body);
    }

    public async get(
        sourceConfig: ISourceConfig,
        path: string,
        query?: {}
    ): Promise<request.Response> {
        return await this.performRequest(
            this.getUrl(sourceConfig.url, `api/v4/${path}`),
            sourceConfig.apitoken,
            url => request.get(url),
            query
        );
    }

    private performRequest(
        url: string,
        apiToken: string,
        requestFactory: (url: string) => request.SuperAgentRequest,
        query?: {}
    ): Promise<request.Response> {
        const req = requestFactory(url)
            .set('PRIVATE-TOKEN', apiToken)
            .accept('application/json');

        if (query) {
            req.query(query);
        }

        return req;
    }

    private getUrl(baseUrl: string, path: string) {
        return (
            `${baseUrl}/${path}`
                // Remove any duplicate slashes due to user config input
                .replace(/\/\//g, '/')
                // Make sure that the protocol at the start of the url is correctly
                // terminated with a double slash
                .replace('/', '//')
        );
    }
}
