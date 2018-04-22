import { GitLabWikiService } from '../GitLabWikiService';
import { GitLabApiRepository } from '../GitLabApiRepository';
import { MarkdownParserService } from '../../../markdown/MarkdownParserService';
import { CacheService } from '../../../cache/CacheService';
import { ISourceConfig } from '../../../../IConfig';

describe('GitLabWikiService', () => {
    let gitLabApiRepositoryMock: Partial<GitLabApiRepository>;
    let markdownParserServiceMock: Partial<MarkdownParserService>;
    let pageTreeCacheMock: Partial<CacheService<any, any>>;
    let pageCacheMock: Partial<CacheService<any, any>>;
    let sourceConfigMock: ISourceConfig;
    let gitLabWikiService: GitLabWikiService;

    beforeEach(() => {
        gitLabApiRepositoryMock = {
            get: jest.fn(),
            getUploadedFile: jest.fn()
        };

        markdownParserServiceMock = {
            parse: jest.fn(() => Promise.resolve(''))
        };

        pageTreeCacheMock = {
            initialize: jest.fn(),
            get: jest.fn(),
            set: jest.fn()
        };

        pageCacheMock = {
            initialize: jest.fn(),
            get: jest.fn(),
            set: jest.fn()
        };

        sourceConfigMock = {
            name: 'test-source',
            homeslug: 'slug',
            apitoken: '1234',
            projectid: '12',
            url: 'http://gitlab'
        };

        gitLabWikiService = new GitLabWikiService(
            gitLabApiRepositoryMock as GitLabApiRepository,
            markdownParserServiceMock as MarkdownParserService,
            pageTreeCacheMock as any,
            pageCacheMock as any
        );
    });

    describe('getPageTree', () => {
        test('should return an empty tree if api returns empty list', async () => {
            gitLabApiRepositoryMock.get = jest.fn(() => Promise.resolve({ body: [] }));

            const tree = await gitLabWikiService.getPageTree(sourceConfigMock);

            expect(tree).toEqual([]);
        });

        test('should not include pages that are not markdown', async () => {
            gitLabApiRepositoryMock.get = jest.fn(() =>
                Promise.resolve({
                    body: [
                        {
                            format: 'asciidoc'
                        },
                        {
                            format: 'somethingelse'
                        },
                        {
                            slug: 'some-path',
                            title: 'some title',
                            format: 'markdown'
                        }
                    ]
                })
            );

            const tree = await gitLabWikiService.getPageTree(sourceConfigMock);

            expect(tree.length).toBe(1);
            expect(tree[0].page!.format).toEqual('markdown');
        });

        test('should group pages with the same slug', async () => {
            gitLabApiRepositoryMock.get = jest.fn(() =>
                Promise.resolve({
                    body: [
                        {
                            slug: 'a',
                            title: 'some title',
                            format: 'markdown'
                        },
                        {
                            slug: 'a/b',
                            title: 'some title',
                            format: 'markdown'
                        },
                        {
                            slug: 'a/b/c/da',
                            title: 'some title',
                            format: 'markdown'
                        },
                        {
                            slug: 'a/b/c/db',
                            title: 'some title',
                            format: 'markdown'
                        },
                        {
                            slug: 'a/b/c/dc',
                            title: 'some title',
                            format: 'markdown'
                        },
                        {
                            slug: 'b',
                            title: 'some title',
                            format: 'markdown'
                        },
                        {
                            slug: 'b/c/d',
                            title: 'some title',
                            format: 'markdown'
                        },
                        {
                            slug: 'b/c/d',
                            title: 'some title',
                            format: 'markdown'
                        }
                    ]
                })
            );

            const tree = await gitLabWikiService.getPageTree(sourceConfigMock);

            // We should have 2 top nodes
            expect(tree.length).toBe(2);
            expect(tree[0].slugPart).toBe('a');
            expect(tree[1].slugPart).toBe('b');

            // The first top node should have one immediate child
            const immediateChild = tree[0].children[0];
            expect(tree[0].children.length).toBe(1);
            expect(immediateChild.slugPart).toBe('b');

            // The immediate child should have one immediate child as well
            const immediateChildOfImmediateChild = immediateChild.children[0];
            expect(immediateChild.children.length).toBe(1);
            expect(immediateChildOfImmediateChild.slugPart).toBe('c');
            expect(immediateChildOfImmediateChild.page).toBeNull();

            // The bottom of the top node should consist of 3 children
            expect(immediateChildOfImmediateChild.children.length).toBe(3);
            expect(immediateChildOfImmediateChild.children[0].slugPart).toBe('da');
            expect(immediateChildOfImmediateChild.children[1].slugPart).toBe('db');
            expect(immediateChildOfImmediateChild.children[2].slugPart).toBe('dc');
        });

        test('should make titles start with an upper case character and remove dashes', async () => {
            gitLabApiRepositoryMock.get = jest.fn(() =>
                Promise.resolve({
                    body: [
                        {
                            slug: 'some-path',
                            title: 'some-title-that-contains-stuff',
                            format: 'markdown'
                        }
                    ]
                })
            );

            const tree = await gitLabWikiService.getPageTree(sourceConfigMock);

            expect(tree.length).toBe(1);
            expect(tree[0].title).toEqual('Some title that contains stuff');
        });

        test('should cache tree if retrieved from API', async () => {
            gitLabApiRepositoryMock.get = jest.fn(() =>
                Promise.resolve({
                    body: []
                })
            );

            const tree = await gitLabWikiService.getPageTree(sourceConfigMock);

            expect(pageTreeCacheMock.set).toHaveBeenCalledWith('test-source-tree', tree);
        });

        test('should use cached tree if available', async () => {
            const cachedTree = { treeProp: 'test' };
            pageTreeCacheMock.get = jest.fn(() => cachedTree);

            const tree = await gitLabWikiService.getPageTree(sourceConfigMock);

            expect(pageTreeCacheMock.get).toHaveBeenCalledWith('test-source-tree');
            expect(gitLabApiRepositoryMock.get).not.toHaveBeenCalled();
            expect(cachedTree).toBe(tree);
        });
    });

    describe('getPage', () => {
        test('should use cached page if available', async () => {
            const cachedPage = { pageProp: 'test' };
            pageCacheMock.get = jest.fn(() => cachedPage);

            const page = await gitLabWikiService.getPage(sourceConfigMock, 'slug');

            expect(page).toBe(cachedPage);
            expect(pageCacheMock.get).toHaveBeenCalledWith('test-source-slug');
            expect(gitLabApiRepositoryMock.get).not.toHaveBeenCalled();
        });

        test('should parse and cache page if retreived', async () => {
            gitLabApiRepositoryMock.get = jest.fn(() =>
                Promise.resolve({
                    body: {
                        content: 'markdown',
                        format: 'markdown',
                        slug: 'slug',
                        title: 'some title'
                    }
                })
            );
            markdownParserServiceMock.parse = jest.fn(() => Promise.resolve('parsed markdown'));

            const page = await gitLabWikiService.getPage(sourceConfigMock, 'slug');

            expect(page.content).toEqual('parsed markdown');
            expect(markdownParserServiceMock.parse).toHaveBeenCalledWith(
                'markdown',
                'test-source',
                'slug'
            );
            expect(pageCacheMock.set).toBeCalledWith('test-source-slug', page);
        });
    });
});
