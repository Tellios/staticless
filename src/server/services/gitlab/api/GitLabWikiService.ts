import { injectable } from "inversify";
import * as marked from "marked";
import { Staticless } from "../../../../models/gitlab.d";
import { Config } from "../../../Config";
import { GitLabApiRepository } from "./GitLabApiRepository";

@injectable()
export class GitLabWikiService {
    constructor(
        private config: Config,
        private api: GitLabApiRepository
    ) { }

    public async getPageList(): Promise<Staticless.GitLab.IWikiPageTreeItem[]> {
        const path = this.getWikiApiPath();
        const response = await this.api.get(path, { with_content: 0 });

        const pages = (response.body as any[])
            .map((pageItem) => {
                return { ...pageItem } as Staticless.GitLab.IWikiPageItem;
            })
            .filter((pageItem) => {
                return pageItem.format === "markdown";
            });

        return this.createPageTree(pages);
    }

    public async getPage(slug: string): Promise<Staticless.GitLab.IWikiPage> {
        let path = this.getWikiApiPath();
        path += `/${encodeURIComponent(slug)}`;

        const response = await this.api.get(path);
        const page = response.body as Staticless.GitLab.IWikiPage;

        return new Promise<Staticless.GitLab.IWikiPage>((resolve, reject) => {
            marked(page.content, { gfm: true }, (err, result) => {
                if (err) {
                    return reject(new Error(`Unable to parse page: ${slug}`));
                }

                page.content = result;
                resolve(page);
            });
        });
    }

    private getWikiApiPath() {
        return `projects/${this.config.get().gitlab.projectId}/wikis`;
    }

    private createPageTree(pages: Staticless.GitLab.IWikiPageItem[]): Staticless.GitLab.IWikiPageTreeItem[] {
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
        return pages.map((page) => {
            return {
                slugParts: page.slug.split("/"),
                ...page
            };
        }).sort((a, b) => {
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
        tree: Staticless.GitLab.IWikiPageTreeItem[]
    ): { node: Staticless.GitLab.IWikiPageTreeItem, slugParts: string[] } | undefined {
        const currentSlug = slugParts[0];
        const shiftedSlugParts = slugParts.slice(1);

        for (const node of tree) {
            if (node.slugPart === currentSlug) {
                if (shiftedSlugParts && shiftedSlugParts.length > 0) {
                    return this.findTreeNode(shiftedSlugParts, node.children);
                } else {
                    return { node, slugParts: shiftedSlugParts };
                }
            }
        }

        return undefined;
    }

    private addNode(
        tree: Staticless.GitLab.IWikiPageTreeItem[],
        slugParts: string[],
        page: Staticless.GitLab.IWikiPageItemWithSlugParts
    ) {
        for (let i = 0; i < slugParts.length; i++) {
            const part = slugParts[i];

            if (i === (slugParts.length - 1)) {
                tree.push({
                    children: [],
                    page,
                    slugPart: part,
                    title: page.title
                });
            } else {
                const node = {
                    children: [],
                    page: null,
                    slugPart: part,
                    title: part
                };
                tree.push(node);
                tree = node.children;
            }
        }
    }
}
