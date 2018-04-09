declare namespace Client {
    interface IState {
        settings: Client.ISettingsState;
        config: Client.IConfigState;
        wiki: IWikiState;
    }

    interface IEmptyAction {
        readonly type: string;
    }

    interface IAction<TPayload> {
        readonly type: string;
        payload: TPayload;
    }

    interface IWikiState {
        page: Staticless.GitLab.IWikiPage | null;
        pageLoading: boolean;
        pageLoaded: boolean;
        pageError: Error | null;

        menu: Staticless.GitLab.IWikiPageTreeItem[];
        menuLoading: boolean;
        menuLoaded: boolean;
        menuError: Error | null;
    }
}
