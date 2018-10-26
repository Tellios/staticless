import { ResponseToolkit, Request } from 'hapi';
import { injectable } from 'inversify';
import { Config } from '../Config';
import { controller, get } from '../decorators/routing';
import { BaseController } from './base/BaseController';

@controller('/frontendConfig')
@injectable()
export class FrontendConfigController extends BaseController {
    constructor(private config: Config) {
        super();
    }

    @get('/')
    public index(request: Request, response: ResponseToolkit) {
        try {
            return response.response(this.config.get().frontend);
        } catch (error) {
            return response.response(error.toString()).code(500);
        }
    }

    @get('/sources')
    public getSources(request: Request, response: ResponseToolkit) {
        try {
            return response.response(
                this.config.get().sources.map((source): Staticless.Config.ISource => ({
                    name: source.name,
                    homeSlug: source.homeslug
                }))
            );
        } catch (error) {
            return response.response(error.toString()).code(500);
        }
    }
}
