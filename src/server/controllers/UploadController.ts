import { ResponseToolkit, Request } from 'hapi';
import { injectable } from 'inversify';
import { Config } from '../Config';
import { controller, get } from '../decorators/routing';
import { BaseController } from './base/BaseController';
import { GitLabUploadService } from '../services/gitlab/api/GitLabUploadService';

@controller('/uploads')
@injectable()
export class UploadController extends BaseController {
    constructor(private config: Config, private uploads: GitLabUploadService) {
        super();
    }

    @get('/{sourceName}/{fileId}/{filename}')
    public async index(request: Request, response: ResponseToolkit) {
        try {
            const sourceConfig = this.config.getSourceConfig(request.params.sourceName);

            if (!sourceConfig) {
                return response.response('Unknown source').code(404);
            }

            const file = await this.uploads.getUploadedFile(
                sourceConfig,
                request.params.fileId,
                request.params.filename
            );
            return response.response(file);
        } catch (error) {
            return response.response(error.toString()).code(500);
        }
    }
}
