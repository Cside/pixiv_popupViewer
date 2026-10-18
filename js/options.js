const popupWidth = document.getElementById("popupWidth");
const popupHeight = document.getElementById("popupHeight");
const mobileView = document.getElementById("mobileView");

function restore(){
    chrome.storage.local.get(null, items => {
        if (items.popupWidth !== undefined) popupWidth.value = items.popupWidth;
        if (items.popupHeight !== undefined) popupHeight.value = items.popupHeight;
        if (items.mobileView !== undefined) mobileView.checked = items.mobileView;
    })
}

function save() {
    chrome.storage.local.set({ 
        "popupWidth": popupWidth.value,
        "popupHeight": popupHeight.value,
        "mobileView": mobileView.checked,
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