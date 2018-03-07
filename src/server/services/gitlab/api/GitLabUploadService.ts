import { upperFirst } from "lodash";
import { injectable } from "inversify";
import { Config } from "../../../Config";
import * as request from "superagent";
import * as stream from "stream";
import { GitLabApiRepository } from "./GitLabApiRepository";
import { GitLabProjectService } from "./GitLabProjectService";
import { ISourceConfig } from "../../../IConfig";

@injectable()
export class GitLabUploadService {
    constructor(
        private api: GitLabApiRepository,
        private projectService: GitLabProjectService
    ) { }

    public async getUploadedFile(sourceConfig: ISourceConfig, fileId: string, filename: string): Promise<any[]> {
        const project = await this.projectService.getProject(sourceConfig);
        return await this.api.getUploadedFile(sourceConfig, project.path_with_namespace, fileId, filename);
    }
}
