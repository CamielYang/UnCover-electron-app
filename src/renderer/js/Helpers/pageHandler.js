export const PageHandler = (function() {
    let mainPageId = "overlayPage";
    let currentPageId = mainPageId;

    function switchPage(pageId) {
        $(currentPageId).style.display = "none"
        $(pageId).style.display = "flex"

        currentPageId = pageId;
    }

    function switchToMainPage() {
        $(currentPageId).style.display = "none"
        $(mainPageId).style.display = "flex"

        currentPageId = mainPageId;
    }

    function $(elementId) {
        return document.getElementById(elementId);
    }

    return {
        switchPage,
        switchToMainPage
    }
})();