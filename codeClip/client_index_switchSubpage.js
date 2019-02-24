function clickMainMenu(index) {
    contentFrame.src = folder + contentName[index] + ".html"
    contentFrame.onload = function () {
        resizeIframe(contentFrame)
    }
}