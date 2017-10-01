import {
    Base_Reply,
    Request,
} from "hapi";
import { injectable } from "inversify";
import {
    controller,
    get,
} from "../decorators/routing";
import { Log } from "../Log";
import { BaseController } from "./base/BaseController";

@controller("/wiki")
@injectable()
export class WikiController extends BaseController {
    constructor(private log: Log) {
        super();
    }

    @get("/test")
    public test(request: Request, reply: Base_Reply) {
        reply.response("Hello world");
    }
}
