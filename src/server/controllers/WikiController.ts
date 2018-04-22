import { Base_Reply, Request } from 'hapi';
import { injectable } from 'inversify';
import { controller, get } from '../decorators/routing';
import { Log } from '../Log';
import { GitLabWikiService } from '../services/gitlab/api/GitLabWikiService';
import { BaseController } from './base/BaseController';
import { Config } from '../Config';

@controller('/wiki')
@injectable()
export class WikiController extends BaseController {
    constructor(private config: Config, private log: Log, private wikiService: GitLabWikiService) {
        super();
    }

    @get('/{sourceName}')
    public async index(request: Request, reply: Base_Reply) {
        try {
            const sourceConfig = this.config.getSourceConfig(request.params.sourceName);

            if (!sourceConfig) {
                reply.response('Unknown source').code(400);
                return;
            }

            const pageList = await this.wikiService.getPageTree(sourceConfig);
            reply.response(pageList);
        } catch (error) {
            reply.response(error.toString()).code(500);
        }
    }

    @get('/{sourceName}/{slug*}')
    public async getPage(request: Request, reply: Base_Reply) {
        try {
            const sourceConfig = this.config.getSourceConfig(request.params.sourceName);

            if (!sourceConfig) {
                reply.response('Unknown source').code(400);
                return;
            }

            const slug = request.params.slug as string;
            const page = await this.wikiService.getPage(sourceConfig, slug);
            reply.response(page);
        } catch (error) {
            reply.response(error.toString()).code(error.status);
        }
    }
}
