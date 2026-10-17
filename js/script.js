window.onload = async () => {
    let aTags;
    let timerId = 0;
    const searchClass = ["_one-click-bookmark", "js-click-trackable", "opener", "item"];
    let options = {
        popupTarget: undefined,
        popupWidth :undefined,
        popupHeight :undefined,
        popupZoom : undefined,
        notZo :undefined,
        autoSeeAll :undefined,
    };
    const observer = new MutationObserver(setEventHandler);
    const target = document.body;
    const config = { childList: true, subtree: true };

    observer.observe(target, config);

    const iframe_container = document.createElement("div");
    iframe_container.id = "pixiv_popupViewer_container";
    const iframe = document.createElement("iframe");
    iframe.id = "pixiv_popupViewer";
    if (localStorage.getItem("theme") === "dark") iframe.classList.add("dark");

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

    const alert_bookmark = document.createElement("div");
    alert_bookmark.id = "pixiv_popupViewer_alert_bookmark";
    alert_bookmark.innerHTML = '<svg viewBox="0 0 32 32" width="72px" height="72px" class="sc-j89e3c-1 bXjFLc"><path d=" M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path><path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="sc-j89e3c-0 dUurgf"></path></svg>';
    alert_bookmark.title = "ブックマーク";

    options = await getStorageOptions();
    compressPopup(options.popupWidth, options.popupHeight);

    target.append(iframe_container);
    iframe_container.append(iframe, switch_expand_button, previous_work_button, next_work_button, alert_bookmark);

    window.onstorage = function (e) {
        if (e.key !== "theme") return;

        if (localStorage.getItem("theme") === "dark") iframe.classList.add("dark");
        else iframe.classList.remove("dark");
    }

    iframe_container.onclick = function () {
        if (!iframe_container.classList.contains("show")) return;

        iframe.contentWindow.location.replace("about:blank");
        iframe_container.classList.remove("show");

        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        observer.observe(target, config);
    }

    const closePopupOnEscape = event => {
        if (event.key === "Escape") iframe_container.click();
    }
    document.addEventListener("keydown", closePopupOnEscape);
    iframe.addEventListener("load", () => {
        iframe.contentDocument.addEventListener("keydown", closePopupOnEscape);
    });

    switch_expand_button.onclick = function (event) {
        event.stopPropagation();

        if (iframe.classList.contains("expand")) {
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

    function changeWork(event) {
        event.stopPropagation();

        const currentIndex = Number(iframe.dataset.currentIndex);

        if (event.target.id === "pixiv_popupViewer_previous_work_button") {
            for (let i = currentIndex; 0 < i; i--) {
                const aTag = aTags[i];

                if (!aTag || aTag.href === aTags[currentIndex].href) continue;

                if (aTag.href === aTags[0].href) previous_work_button.classList.remove("show");
                else previous_work_button.classList.add("show");

                next_work_button.classList.add("show");

                iframe.contentWindow.location.replace(aTag.href);
                iframe.dataset.currentIndex = i;

                return;
            }
        } else if (event.target.id === "pixiv_popupViewer_next_work_button") {
            for (let i = currentIndex; i < aTags.length; i++) {
                const aTag = aTags[i];

                if (!aTag || aTag.href === aTags[currentIndex].href) continue;

                if (aTag.href === aTags[aTags.length - 1].href) next_work_button.classList.remove("show");
                else next_work_button.classList.add("show");

                previous_work_button.classList.add("show");

                iframe.contentWindow.location.replace(aTag.href);
                iframe.dataset.currentIndex = i;

                return;
            }
        }
    }

    function setEventHandler() {
        if (options.popupTarget === undefined) aTags = Array.from(document.querySelectorAll('a[href^="/artworks/"], a[href^="/novel/show.php?"]'));
        else aTags = Array.from(document.querySelectorAll(options.popupTarget));

        aTags.forEach(element => {
            element.onclick = function (event) {
                event.preventDefault();

                for (let i = 0; i < searchClass.length; i++) {
                    if (event.target.classList.contains(searchClass[i])) return;
                }

                observer.disconnect();

                if (element.href === aTags[0].href) previous_work_button.classList.remove("show");
                else previous_work_button.classList.add("show");

                if (element.href === aTags[aTags.length - 1].href) next_work_button.classList.remove("show");
                else next_work_button.classList.add("show");

                iframe.dataset.currentIndex = aTags.findIndex(aTag => aTag === element);

                iframe.contentWindow.location.replace(element.href);
                iframe_container.classList.add("show");

                document.getElementsByTagName("html")[0].style.overflowY = "hidden";

                const autoSeeAll_interval = setInterval(() => {
                    if (!options.autoSeeAll) return;

                    if (!iframe_container.classList.contains("show")) clearInterval(autoSeeAll_interval);
                    if (iframe.contentWindow.document.querySelector("button.sc-9222a8f6-0.eJosta")) iframe.contentWindow.document.querySelector("button.sc-9222a8f6-0.eJosta").click();
                    if (iframe.contentWindow.document.querySelector("button.sc-e3cb8b83-0.LDEei")) iframe.contentWindow.document.querySelector("button.sc-e3cb8b83-0.LDEei").click();
                    if (iframe.contentWindow.document.querySelector(".button-link")) iframe.contentWindow.document.querySelector(".button-link").click();
                }, 100)

                zoomPopup();
            };
        });
    }

    function getStorageOptions() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["popupTarget", "popupWidth", "popupHeight", "popupZoom", "notZoomWhenExpand", "autoSeeAll"], items => resolve(items))
        })
    }

    function compressPopup(width = "80%", height = "90%") {
        iframe.classList.remove("expand");

        iframe.style.width = width + "%";
        iframe.style.height = height + "%";
    }

    function expandPopup() {
        iframe.classList.add("expand");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
    }

    function zoomPopup() {
        if (options.popupZoom === undefined) return;

        const interval = setInterval(() => {
            if (!iframe_container.classList.contains("show")) clearInterval(interval);

            if (iframe.contentDocument.body) {
                if (options.notZoomWhenExpand && iframe.classList.contains("expand")) iframe.contentDocument.body.style.zoom = "normal";
                else iframe.contentDocument.body.style.zoom = options.popupZoom + "%";
            }
        }, 100);
    }

    chrome.storage.onChanged.addListener(items => {
        if (items.popupTarget) options.popupTarget = items.popupTarget.newValue;
        if (items.popupWidth) options.popupWidth = items.popupWidth.newValue;
        if (items.popupHeight) options.popupHeight = items.popupHeight.newValue;
        if (items.popupZoom) options.popupZoom = items.popupZoom.newValue;
        if (items.notZoomWhenExpand) options.notZoomWhenExpand = items.notZoomWhenExpand.newValue;
        if (items.autoSeeAll) options.autoSeeAll = items.autoSeeAll.newValue;

        if (iframe.classList.contains("expand")) return;

        compressPopup(options.popupWidth, options.popupHeight);
    })

    chrome.runtime.onMessage.addListener(request => {
        if (!iframe_container.classList.contains("show")) return;

        if (request === "expand") switch_expand_button.click();
        if (request === "prev_work") previous_work_button.click();
        if (request === "next_work") next_work_button.click();
        if (request === "add_bookmark") {
            if (iframe.contentWindow.document.querySelector("button.gtm-main-bookmark")) iframe.contentWindow.document.querySelector("button.gtm-main-bookmark").click();
            else if (iframe.contentWindow.document.querySelector(".works-bookmark-button.work-interactions-panel-item > svg[xmlns]")) iframe.contentWindow.document.querySelector(".works-bookmark-button.work-interactions-panel-item").click();
            else return;

            alert_bookmark.classList.add("show");

            clearTimeout(timerId);

            timerId = setTimeout(() => {
                alert_bookmark.classList.remove("show");
            }, 1000);
        }
        if (request === "close_popup") iframe_container.click();
    })
}
