import { upperFirst } from 'lodash';
import { injectable } from 'inversify';
import { Config } from '../../../Config';
import { MarkdownParserService } from '../../markdown/MarkdownParserService';
import { GitLabApiRepository } from './GitLabApiRepository';
import { CacheService } from '../../cache/CacheService';
import { ISourceConfig } from '../../../IConfig';

@injectable()
export class GitLabWikiService {
    constructor(
        private api: GitLabApiRepository,
        private markdown: MarkdownParserService,
        private pageTreeCache: CacheService<string, Staticless.GitLab.IWikiPageTreeItem[]>,
        private pageCache: CacheService<string, Staticless.GitLab.IWikiPage>
    ) {
        this.pageTreeCache.initialize();
        this.pageCache.initialize();
    }

    public async getPageTree(
        sourceConfig: ISourceConfig
    ): Promise<Staticless.GitLab.IWikiPageTreeItem[]> {
        const cacheKey = `${sourceConfig.name}-tree`;
        let pageTree = this.pageTreeCache.get(cacheKey);

        if (pageTree) {
            return pageTree;
        }

        const path = this.getWikiApiPath(sourceConfig.projectid);
        const response = await this.api.get(sourceConfig, path, { with_content: 0 });

        const pages = (response.body as any[])
            .map(pageItem => {
                return { ...pageItem } as Staticless.GitLab.IWikiPageItem;
            })
            .filter(pageItem => {
                return pageItem.format === 'markdown';
            });

        pageTree = this.createPageTree(pages);
        this.pageTreeCache.set(cacheKey, pageTree);

        return pageTree;
    }

    public async getPage(
        sourceConfig: ISourceConfig,
        slug: string
    ): Promise<Staticless.GitLab.IWikiPage> {
        const cacheKey = `${sourceConfig.name}-${slug}`;
        let page = this.pageCache.get(cacheKey);

        if (page) {
            return page;
        }

        let path = this.getWikiApiPath(sourceConfig.projectid);
        path += `/${encodeURIComponent(slug)}`;

        const response = await this.api.get(sourceConfig, path);
        page = response.body as Staticless.GitLab.IWikiPage;
        page.content = await this.markdown.parse(page.content, sourceConfig.name, slug);

        this.pageCache.set(cacheKey, page);

        return page;
    }

    private getWikiApiPath(projectId: string) {
        return `projects/${projectId}/wikis`;
    }

    private createPageTree(
        pages: Staticless.GitLab.IWikiPageItem[]
    ): Staticless.GitLab.IWikiPageTreeItem[] {
        const tree: Staticless.GitLab.IWikiPageTreeItem[] = [];

        const pagesWithSlugParts = this.getPagesWithSlugParts(pages);

        for (const page of pagesWithSlugParts) {
            this.appendPageToTree(tree, page);
        }

        return tree;
    }

    private getPagesWithSlugParts(
        pages: Staticless.GitLab.IWikiPageItem[]
    ): Staticless.GitLab.IWikiPageItemWithSlugParts[] {
        return pages
            .map(page => {
                return {
                    slugParts: page.slug.split('/'),
                    ...page
                };
            })
            .sort((a, b) => {
                const aLength = a.slugParts.length;
                const bLength = b.slugParts.length;

                if (aLength > bLength) {
                    return 1;
                } else if (aLength < bLength) {
                    return -1;
                } else {
                    return 0;
                }
            });
    }

    private appendPageToTree(
        tree: Staticless.GitLab.IWikiPageTreeItem[],
        pageWithSlugParts: Staticless.GitLab.IWikiPageItemWithSlugParts
    ) {
        const nodeItem = this.findTreeNode(pageWithSlugParts.slugParts, tree);

        if (nodeItem) {
            this.addNode(nodeItem.node.children, nodeItem.slugParts, pageWithSlugParts);
        } else {
            this.addNode(tree, pageWithSlugParts.slugParts, pageWithSlugParts);
        }
    }

    private findTreeNode(
        slugParts: string[],
        tree: Staticless.GitLab.IWikiPageTreeItem[],
        currentNode?: Staticless.GitLab.IWikiPageTreeItem
    ): { node: Staticless.GitLab.IWikiPageTreeItem; slugParts: string[] } | undefined {
        const currentSlug = slugParts[0];
        const shiftedSlugParts = slugParts.slice(1);

        for (const node of tree) {
            if (node.slugPart === currentSlug) {
                if (shiftedSlugParts && shiftedSlugParts.length > 0) {
                    return this.findTreeNode(shiftedSlugParts, node.children, node);
                } else {
                    return { node, slugParts: shiftedSlugParts };
                }
            }
        }

        if (currentNode) {
            return {
                node: currentNode,
                slugParts
            };
        }

        return undefined;
    }

    private addNode(
        tree: Staticless.GitLab.IWikiPageTreeItem[],
        slugParts: string[],
        page: Staticless.GitLab.IWikiPageItemWithSlugParts
    ) {
        const endIndex = slugParts.length - 1;

        for (let i = 0; i < slugParts.length; i++) {
            const slug = slugParts.slice(0, i + 1).join('/');
            const part = slugParts[i];

            if (i === endIndex) {
                tree.push({
                    children: [],
                    page,
                    slugPart: part,
                    title: this.getReadableTitle(page.title)
                });
            } else {
                const node = {
                    children: [],
                    page: null,
                    slugPart: part,
                    title: this.getReadableTitle(part)
                };
                tree.push(node);
                tree = node.children;
            }
        }
    }

    private getReadableTitle(title: string) {
        return upperFirst(title).replace(/-/g, ' ');
    }
}
