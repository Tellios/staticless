import { GitLabProjectService } from '../GitLabProjectService';
import { GitLabApiRepository } from '../GitLabApiRepository';
import { CacheService } from '../../../cache/CacheService';
import { ISourceConfig } from '../../../../IConfig';

describe('GitLabProjectService', () => {
    const PROJECT_ID_MOCK = '1';
    let projectMock: GitLabApi.IProject;
    let gitLabApiRepositoryMock: Partial<GitLabApiRepository>;
    let cacheServiceMock: Partial<CacheService<string, GitLabApi.IProject>>;
    let sourceConfigMock: ISourceConfig;
    let gitLabProjectService: GitLabProjectService;

    beforeEach(() => {
        projectMock = {
            path_with_namespace: 'project/path'
        };

        gitLabApiRepositoryMock = {
            get: jest.fn(() => Promise.resolve({ body: projectMock }))
        };

        cacheServiceMock = {
            initialize: jest.fn(),
            set: jest.fn(),
            get: jest.fn()
        };

        sourceConfigMock = {
            name: 'test-source',
            homeslug: 'slug',
            apitoken: '1234',
            projectid: PROJECT_ID_MOCK,
            url: 'http://gitlab'
        };

        gitLabProjectService = new GitLabProjectService(
            gitLabApiRepositoryMock as GitLabApiRepository,
            cacheServiceMock as CacheService<string, GitLabApi.IProject>
        );
    });

    describe('getProject', () => {
        test('should cache project if retrieved', async () => {
            const project = await gitLabProjectService.getProject(sourceConfigMock);

            expect(cacheServiceMock.set).toBeCalledWith(
                `test-source-${PROJECT_ID_MOCK}`,
                projectMock
            );
            expect(project).toBe(projectMock);
        });

        test('should used cache project if available', async () => {
            cacheServiceMock.get = jest.fn(() => projectMock);

            const project = await gitLabProjectService.getProject(sourceConfigMock);

            expect(gitLabApiRepositoryMock.get).not.toHaveBeenCalled();
            expect(cacheServiceMock.get).toHaveBeenCalledWith(`test-source-${PROJECT_ID_MOCK}`);
            expect(project).toBe(projectMock);
        });
    });
});
