import { upperFirst } from "lodash";
import { injectable } from "inversify";
import { Config } from "../../../Config";
import * as request from "superagent";
import * as stream from "stream";
import { GitLabApiRepository } from "./GitLabApiRepository";

@injectable()
export class GitLabUploadService {
    constructor(
        private config: Config,
        private api: GitLabApiRepository
    ) { }

    public async getUploadedFile(fileId: string, filename: string): Promise<any[]> {
        return await this.api.getUploadedFile(fileId, filename);
    }
}
