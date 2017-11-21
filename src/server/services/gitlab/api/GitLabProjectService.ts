import { injectable } from "inversify";
import { GitLabApiRepository } from "./GitLabApiRepository";
import { Config } from "../../../Config";
import { CacheService } from "../../CacheService";

@injectable()
export class GitLabProjectService {
    constructor(
        private api: GitLabApiRepository,
        private cacheService: CacheService<string, GitLabApi.Project>
    ) {
        this.cacheService.initialize(30);
    }

    public async getProject(projectId: string): Promise<GitLabApi.Project> {
        const project = this.cacheService.get(projectId);

        if (project) {
            return project;
        }

        const { body } = await this.api.get(`projects/${projectId}`);
        this.cacheService.set(projectId, body);

        return body;
    }
}
