chrome.commands.onCommand.addListener((command) => {
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        await chrome.tabs.sendMessage(tab.id, command);
      })();
});

chrome.storage.local.get("mobileView", item => {
    if (item.mobileView === true) chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["ruleset"]});
})