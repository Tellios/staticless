import { injectable } from "inversify";
import { GitLabApiRepository } from "./GitLabApiRepository";
import { CacheService } from "../../cache/CacheService";
import { ISourceConfig } from "../../../IConfig";

@injectable()
export class GitLabProjectService {
    constructor(
        private api: GitLabApiRepository,
        private cacheService: CacheService<string, GitLabApi.IProject>
    ) {
        this.cacheService.initialize();
    }

    public async getProject(sourceConfig: ISourceConfig): Promise<GitLabApi.IProject> {
        const cacheKey = `${sourceConfig.name}-${sourceConfig.projectid}`;
        const project = this.cacheService.get(cacheKey);

        if (project) {
            return project;
        }

        const { body } = await this.api.get(sourceConfig, `projects/${sourceConfig.projectid}`);
        this.cacheService.set(cacheKey, body);

        return body;
    }
}
