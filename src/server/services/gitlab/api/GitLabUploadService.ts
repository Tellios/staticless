import { upperFirst } from "lodash";
import { injectable } from "inversify";
import { Config } from "../../../Config";
import * as request from "superagent";
import * as stream from "stream";
import { GitLabApiRepository } from "./GitLabApiRepository";
import { GitLabProjectService } from "./GitLabProjectService";

@injectable()
export class GitLabUploadService {
    constructor(
        private config: Config,
        private api: GitLabApiRepository,
        private projectService: GitLabProjectService
    ) { }

    public async getUploadedFile(fileId: string, filename: string): Promise<any[]> {
        const config = this.config.get();
        const project = await this.projectService.getProject(config.gitlab.projectId);
        return await this.api.getUploadedFile(project.path_with_namespace, fileId, filename);
    }
}
