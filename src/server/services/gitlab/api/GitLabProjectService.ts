import { injectable } from "inversify";
import { GitLabApiRepository } from "./GitLabApiRepository";
import { CacheService } from "../../cache/CacheService";

@injectable()
export class GitLabProjectService {
    constructor(
        private api: GitLabApiRepository,
        private cacheService: CacheService<string, GitLabApi.IProject>
    ) {
        this.cacheService.initialize();
    }

    public async getProject(projectId: string): Promise<GitLabApi.IProject> {
        const project = this.cacheService.get(projectId);

        if (project) {
            return project;
        }

        const { body } = await this.api.get(`projects/${projectId}`);
        this.cacheService.set(projectId, body);

        return body;
    }
}
