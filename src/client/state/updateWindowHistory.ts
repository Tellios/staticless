export function updateWindowHistory(state: Client.PushState, addToHistory = true) {
    if (addToHistory) {
        window.history.pushState(
            state,
            state.slug,
            `${window.location.origin}/${encodeURIComponent(state.sourceName)}/${state.slug}`
        );
    } else {
        window.history.replaceState(
            state,
            state.slug,
            `${window.location.origin}/${encodeURIComponent(state.sourceName)}/${state.slug}`
        );
    }
}
