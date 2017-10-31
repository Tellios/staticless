import {
    Base_Reply,
    Request
} from "hapi";
import { injectable } from "inversify";
import { Config } from "../Config";
import {
    controller,
    get
} from "../decorators/routing";
import { BaseController } from "./base/BaseController";

@controller("/frontendConfig")
@injectable()
export class FrontendConfigController extends BaseController {
    constructor(private config: Config) {
        super();
    }

    @get("/")
    public async index(request: Request, reply: Base_Reply) {
        try {
            reply.response(this.config.get().frontend);
        } catch (error) {
            reply.response(error.toString())
                .code(500);
        }
    }
}
