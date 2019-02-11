let allScheduledAnimation = [];
window.beginScheduledAnimations = function beginScheduledAnimations() {
    for (let i = 0; i < allScheduledAnimation.length; i++) {
        let animation = allScheduledAnimation[i];
        animation();
    }
}
window.scheduleAnimation = function scheduleAnimation(fun) {
    allScheduledAnimation.push(fun);
}
let analysisPanel = getSlidePanel("analysis", 0, headHeight, window.innerWidth, window.innerHeight - headHeight);
let downloadButton = mainMenu.getItems()[1];
let introductionButton = mainMenu.getItems()[0];
introductionButton.addEventListener("click", hideAnalysis);
downloadButton.addEventListener("click", checkAnalysis)
function checkAnalysis() {
    if (analysisPanel.isOpen()) analysisPanel.close();
    analysisPanel.showButton();
}
function hideAnalysis() {
    if (analysisPanel.isOpen()) analysisPanel.close();
    analysisPanel.hideButton();
}