import { injectable } from "inversify";
import * as marked from "marked";
import { Config } from "../../../Config";
import { GitLabApiRepository } from "./GitLabApiRepository";
import { IWikiPage } from "./IWikiPage";
import { IWikiPageItem } from "./IWikiPageItem";

@injectable()
export class GitLabWikiService {
    constructor(
        private config: Config,
        private api: GitLabApiRepository
    ) { }

    public async getPageList(): Promise<IWikiPageItem[]> {
        const path = this.getWikiApiPath();
        const response = await this.api.get(path, { with_content: 0 });

        return (response.body as any[])
            .map((pageItem) => {
                return { ...pageItem } as IWikiPageItem;
            })
            .filter((pageItem) => {
                return pageItem.format === "markdown";
            });
    }

    public async getPage(slug: string): Promise<IWikiPage> {
        let path = this.getWikiApiPath();
        path += `/${encodeURIComponent(slug)}`;

        const response = await this.api.get(path);
        const page = response.body as IWikiPage;

        return new Promise<IWikiPage>((resolve, reject) => {
            marked(page.content, (err, result) => {
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
}
