const popupTarget = document.getElementById("popupTarget");
const popupWidth = document.getElementById("popupWidth");
const popupHeight = document.getElementById("popupHeight");
const popupZoom = document.getElementById("popupZoom");
const notZoomWhenExpand = document.getElementById("notZoomWhenExpand");
const mobileView = document.getElementById("mobileView");
const autoSeeAll = document.getElementById("autoSeeAll");

function restore(){
    chrome.storage.local.get(null, items => {
        if (items.popupTarget !== undefined) document.querySelector(`option[value='${items.popupTarget}']`).selected = true;
        if (items.popupWidth !== undefined) popupWidth.value = items.popupWidth;
        if (items.popupHeight !== undefined) popupHeight.value = items.popupHeight;
        if (items.popupZoom !== undefined) popupZoom.value = items.popupZoom;
        if (items.notZoomWhenExpand !== undefined) notZoomWhenExpand.checked = items.notZoomWhenExpand;
        if (items.mobileView !== undefined) mobileView.checked = items.mobileView;
        if (items.autoSeeAll !== undefined) autoSeeAll.checked = items.autoSeeAll;
    })
}

function save() {
    chrome.storage.local.set({ 
        "popupTarget": popupTarget.value,
        "popupWidth": popupWidth.value,
        "popupHeight": popupHeight.value,
        "popupZoom": popupZoom.value,
        "notZoomWhenExpand": notZoomWhenExpand.checked,
        "mobileView": mobileView.checked,
        "autoSeeAll": autoSeeAll.checked
    })
    updateRulesets(mobileView.checked);
}

function updateRulesets(status) {
    if (status) chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["ruleset"]});
    else if (!status) chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: ["ruleset"]});
}

restore();

document.querySelectorAll("select, input").forEach(element => {
    element.onchange = save;
});