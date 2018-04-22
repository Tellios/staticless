export function updateWindowHistory(state: Client.PushState) {
    window.history.pushState(
        state,
        state.slug,
        `${window.location.origin}/${encodeURIComponent(state.sourceName)}/${state.slug}`
    );
}
