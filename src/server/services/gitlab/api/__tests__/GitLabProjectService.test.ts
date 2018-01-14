import { GitLabProjectService } from "../GitLabProjectService";
import { GitLabApiRepository } from "../GitLabApiRepository";
import { CacheService } from "../../../cache/CacheService";

describe("GitLabProjectService", () => {
    const PROJECT_ID_MOCK = "1";
    let projectMock: GitLabApi.IProject;
    let gitLabApiRepositoryMock: Partial<GitLabApiRepository>;
    let cacheServiceMock: Partial<CacheService<string, GitLabApi.IProject>>;
    let gitLabProjectService: GitLabProjectService;

    beforeEach(() => {
        projectMock = {
            path_with_namespace: "project/path"
        };

        gitLabApiRepositoryMock = {
            get: jest.fn(() => Promise.resolve({ body: projectMock }))
        };

        cacheServiceMock = {
            initialize: jest.fn(),
            set: jest.fn(),
            get: jest.fn()
        };

        gitLabProjectService = new GitLabProjectService(
            gitLabApiRepositoryMock as GitLabApiRepository,
            cacheServiceMock as CacheService<string, GitLabApi.IProject>
        );
    });

    describe("getProject", () => {
        test("should cache project if retrieved", async () => {
            const project = await gitLabProjectService.getProject(PROJECT_ID_MOCK);

            expect(cacheServiceMock.set).toBeCalledWith(PROJECT_ID_MOCK, projectMock);
            expect(project).toBe(projectMock);
        });

        test("should used cache project if available", async () => {
            cacheServiceMock.get = jest.fn(() => projectMock);

            const project = await gitLabProjectService.getProject(PROJECT_ID_MOCK);

            expect(gitLabApiRepositoryMock.get).not.toHaveBeenCalled();
            expect(cacheServiceMock.get).toHaveBeenCalledWith(PROJECT_ID_MOCK);
            expect(project).toBe(projectMock);
        });
    });
});
