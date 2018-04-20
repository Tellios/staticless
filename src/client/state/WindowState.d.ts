declare namespace Client {
    type PushState = ISourcePushState | IPagePushState;

    interface ISourcePushState {
        readonly type: 'source';
        sourceName: string;
        slug: string;
    }

    interface IPagePushState {
        readonly type: 'page';
        sourceName: string;
        slug: string;
    }
}
