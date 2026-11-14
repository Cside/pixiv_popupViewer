function isArtworkUrl(url = location.href) {
    const pathname = new URL(url).pathname;
    return /^\/artworks\/[^/]+\/?$/.test(pathname);
}

document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || event.repeat || event.isComposing) return;
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (!isArtworkUrl()) return;

    event.preventDefault();
    history.back();
});
