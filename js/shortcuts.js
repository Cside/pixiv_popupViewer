function isArtworkUrl(url = location.href) {
    const pathname = new URL(url).pathname;
    return /^\/artworks\/[^/]+\/?$/.test(pathname);
}

document.addEventListener("keydown", event => {
    if (event.key.toLowerCase() === "s" && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey && !event.repeat && !event.isComposing && /^\/(?:tags\/|users\/|search)/.test(location.pathname)) {
        event.preventDefault();
        document.querySelectorAll("img").forEach(img => {
            if (!img.src.includes("1200")) return;

            img.src = img.src
                .replace(/\/c\/[^/]+\//, "/c/240x480/")
                .replace(/(square|custom)1200/, "master1200")
                .replace("custom-thumb", "img-master");
            img.style.objectFit = "contain";
            img.style.objectPosition = "center center";
        });
        return;
    }

    if (event.key !== "Escape" || event.repeat || event.isComposing) return;
    if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (!isArtworkUrl()) return;

    event.preventDefault();
    history.back();
});
