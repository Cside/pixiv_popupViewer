window.onload = async () => {
    let aTags;
    let activeImageRequest;
    let imageRequestId = 0;
    const searchClass = ["_one-click-bookmark", "js-click-trackable", "opener", "item"];
    let options = {
        popupWidth :undefined,
        popupHeight :undefined,
    };
    const observer = new MutationObserver(setEventHandler);
    const target = document.body;
    const config = { childList: true, subtree: true };

    observer.observe(target, config);

    const popupContainer = document.createElement("div");
    popupContainer.id = "pixiv_popupViewer_container";
    const image = document.createElement("img");
    image.id = "pixiv_popupViewer";
    image.alt = "";
    image.draggable = false;
    const image_status = document.createElement("div");
    image_status.id = "pixiv_popupViewer_status";
    image_status.textContent = "画像を読み込み中...";

    const switch_expand_button = document.createElement("div");
    switch_expand_button.id = "pixiv_popupViewer_switch_expand_button";
    switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"></path></svg>';
    switch_expand_button.title = "最大化";

    const previous_work_button = document.createElement("div");
    previous_work_button.id = "pixiv_popupViewer_previous_work_button";
    previous_work_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="angle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="white" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg>';
    previous_work_button.title = "前の作品";

    const next_work_button = document.createElement("div");
    next_work_button.id = "pixiv_popupViewer_next_work_button";
    next_work_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="white" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg>';
    next_work_button.title = "次の作品";

    options = await getStorageOptions();
    compressPopup(options.popupWidth, options.popupHeight);

    target.append(popupContainer);
    popupContainer.append(image, image_status, switch_expand_button, previous_work_button, next_work_button);

    popupContainer.onclick = function (event) {
        if (event.target !== popupContainer) return;
        if (!popupContainer.classList.contains("show")) return;

        activeImageRequest?.abort();
        activeImageRequest = undefined;
        imageRequestId++;
        image.removeAttribute("src");
        image.hidden = true;
        image_status.hidden = true;
        popupContainer.classList.remove("show");

        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        observer.observe(target, config);
    }

    const handlePopupKeydown = event => {
        if (event.key === "Escape") {
            popupContainer.click();
            return;
        }

        if (!popupContainer.classList.contains("show")) return;

        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            (event.key === "ArrowLeft" ? previous_work_button : next_work_button).click();
        }
    }
    document.addEventListener("keydown", handlePopupKeydown);

    switch_expand_button.onclick = function (event) {
        event.stopPropagation();

        if (image.classList.contains("expand")) {
            switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"></path></svg>';
            compressPopup(options.popupWidth, options.popupHeight);
            switch_expand_button.title = "最大化";
        } else {
            switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="compress" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z"></path></svg>';
            expandPopup();
            switch_expand_button.title = "縮小";
        }
    }

    previous_work_button.onclick = next_work_button.onclick = changeWork;

    async function loadWorkImage(aTag) {
        activeImageRequest?.abort();
        activeImageRequest = new AbortController();
        const requestId = ++imageRequestId;
        const workId = aTag.href.match(/\/artworks\/(\d+)/)?.[1];

        image.hidden = true;
        image.removeAttribute("src");
        image_status.textContent = "画像を読み込み中...";
        image_status.hidden = false;

        try {
            if (!workId) throw new Error(`作品 ID を取得できません: ${aTag.href}`);

            const response = await fetch(`https://www.pixiv.net/ajax/illust/${workId}?lang=ja`, {
                signal: activeImageRequest.signal
            });
            if (!response.ok) throw new Error(`作品情報の取得に失敗しました: HTTP ${response.status}`);

            const data = await response.json();
            const imageUrl = data?.body?.urls?.regular;
            if (data?.error || typeof imageUrl !== "string") {
                throw new Error(data?.message || "作品情報に画像 URL がありません");
            }
            if (requestId !== imageRequestId) return;

            image.onload = () => {
                if (requestId !== imageRequestId) return;
                image.hidden = false;
                image_status.hidden = true;
            };
            image.onerror = () => {
                if (requestId !== imageRequestId) return;
                image_status.textContent = "画像を読み込めませんでした";
                console.error(`作品 ${workId} の画像を読み込めませんでした`);
            };
            image.src = imageUrl;
        } catch (error) {
            if (error.name === "AbortError") return;
            if (requestId !== imageRequestId) return;

            image_status.textContent = "画像を取得できませんでした";
            console.error(`作品 ${workId || aTag.href} の画像を取得できませんでした`, error);
        }
    }

    function changeWork(event) {
        event.stopPropagation();

        const currentIndex = Number(image.dataset.currentIndex);

        if (event.target.id === "pixiv_popupViewer_previous_work_button") {
            for (let i = currentIndex; 0 < i; i--) {
                const aTag = aTags[i];

                if (!aTag || aTag.href === aTags[currentIndex].href) continue;

                if (aTag.href === aTags[0].href) previous_work_button.classList.remove("show");
                else previous_work_button.classList.add("show");

                next_work_button.classList.add("show");

                image.dataset.currentIndex = i;
                loadWorkImage(aTag);

                return;
            }
        } else if (event.target.id === "pixiv_popupViewer_next_work_button") {
            for (let i = currentIndex; i < aTags.length; i++) {
                const aTag = aTags[i];

                if (!aTag || aTag.href === aTags[currentIndex].href) continue;

                if (aTag.href === aTags[aTags.length - 1].href) next_work_button.classList.remove("show");
                else next_work_button.classList.add("show");

                previous_work_button.classList.add("show");

                image.dataset.currentIndex = i;
                loadWorkImage(aTag);

                return;
            }
        }
    }

    function setEventHandler() {
        aTags = Array.from(document.querySelectorAll('a[href^="/artworks/"]'));

        aTags.forEach(element => {
            element.onclick = function (event) {
                if (!event.metaKey) return;
                event.preventDefault();

                for (let i = 0; i < searchClass.length; i++) {
                    if (event.target.classList.contains(searchClass[i])) return;
                }

                observer.disconnect();

                if (element.href === aTags[0].href) previous_work_button.classList.remove("show");
                else previous_work_button.classList.add("show");

                if (element.href === aTags[aTags.length - 1].href) next_work_button.classList.remove("show");
                else next_work_button.classList.add("show");

                image.dataset.currentIndex = aTags.findIndex(aTag => aTag === element);
                popupContainer.classList.add("show");

                document.getElementsByTagName("html")[0].style.overflowY = "hidden";
                loadWorkImage(element);
            };
        });
    }

    function getStorageOptions() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["popupWidth", "popupHeight"], items => resolve(items))
        })
    }

    function compressPopup(width = "80%", height = "90%") {
        image.classList.remove("expand");

        image.style.width = width + "%";
        image.style.height = height + "%";
    }

    function expandPopup() {
        image.classList.add("expand");
        image.style.width = "100%";
        image.style.height = "100%";
    }

    chrome.storage.onChanged.addListener(items => {
        if (items.popupWidth) options.popupWidth = items.popupWidth.newValue;
        if (items.popupHeight) options.popupHeight = items.popupHeight.newValue;

        if (image.classList.contains("expand")) return;

        compressPopup(options.popupWidth, options.popupHeight);
    })

    chrome.runtime.onMessage.addListener(request => {
        if (!popupContainer.classList.contains("show")) return;

        if (request === "expand") switch_expand_button.click();
        if (request === "prev_work") previous_work_button.click();
        if (request === "next_work") next_work_button.click();
        if (request === "close_popup") popupContainer.click();
    })
}
