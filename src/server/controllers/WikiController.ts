import {
    Base_Reply,
    Request
} from "hapi";
import { injectable } from "inversify";
import {
    controller,
    get
} from "../decorators/routing";
import { Log } from "../Log";
import { GitLabWikiService } from "../services/gitlab/api/GitLabWikiService";
import { BaseController } from "./base/BaseController";

@controller("/wiki")
@injectable()
export class WikiController extends BaseController {
    constructor(
        private log: Log,
        private wikiService: GitLabWikiService
    ) {
        super();
    }

    @get("/")
    public async index(request: Request, reply: Base_Reply) {
        try {
            const pageList = await this.wikiService.getPageList();
            reply.response(pageList);
        } catch (error) {
            reply.response(error.toString())
                .code(500);
        }
    }

    @get("/{slug*}")
    public async getPage(request: Request, reply: Base_Reply) {
        try {
            const slug = request.params.slug as string;
            const page = await this.wikiService.getPage(slug);
            reply.response(page);
        } catch (error) {
            reply.response(error.toString())
                .code(error.status);
        }
    }

}
