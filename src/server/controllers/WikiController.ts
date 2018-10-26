import { ResponseToolkit, Request } from 'hapi';
import { injectable } from 'inversify';
import { controller, get } from '../decorators/routing';
import { Log } from '../Log';
import { GitLabWikiService } from '../services/gitlab/api/GitLabWikiService';
import { BaseController } from './base/BaseController';
import { Config } from '../Config';
import { isNumber } from 'lodash';

@controller('/wiki')
@injectable()
export class WikiController extends BaseController {
    constructor(private config: Config, private log: Log, private wikiService: GitLabWikiService) {
        super();
    }

    @get('/{sourceName}')
    public async index(request: Request, response: ResponseToolkit) {
        try {
            const sourceConfig = this.config.getSourceConfig(request.params.sourceName);

            if (!sourceConfig) {
                return response.response('Unknown source').code(400);
            }

            const pageList = await this.wikiService.getPageTree(sourceConfig);
            return response.response(pageList);
        } catch (error) {
            return response.response(error.toString()).code(500);
        }
    }

    @get('/{sourceName}/{slug*}')
    public async getPage(request: Request, response: ResponseToolkit) {
        try {
            const sourceConfig = this.config.getSourceConfig(request.params.sourceName);

            if (!sourceConfig) {
                return response.response('Unknown source').code(400);
            }

            const slug = request.params.slug as string;
            const page = await this.wikiService.getPage(sourceConfig, slug);
            return response.response(page);
        } catch (error) {
            return response
                .response(error.toString())
                .code(isNumber(error.status) ? error.status : 500);
        }
    }
}
