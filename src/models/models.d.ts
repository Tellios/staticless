declare namespace Staticless {
    namespace GitLab {
        interface IWikiPage {
            content: string;
            format: string;
            slug: string;
            title: string;
        }

        interface IWikiPageItem {
            format: string;
            slug: string;
            title: string;
        }

        interface IWikiPageItemWithSlugParts extends IWikiPageItem {
            slugParts: string[];
        }

        interface IWikiPageTreeItem {
            children: IWikiPageTreeItem[];
            slugPart: string;
            title: string;
            page: IWikiPageItem | null;
        }
    }

    namespace Config {
        interface IFrontend {
            title: string;
        }

        interface ISource {
            name: string;
            homeSlug: string;
        }
    }
}
