
/**
 * 
 * @param {string} name 
 * @returns {SlidePanel}
 */
function getSlidePanel(name, x, y, w, h) {
    let button = document.querySelector(`.${name}`);
    button.addEventListener("click", clickButton);
    let panel;
    let status = 0;
    let wid,hei;
    if (!x) x = 0;
    if (!y) y = 0;
    if (!w) wid = window.innerWidth ;else wid=w;
    if (!h) hei = window.innerHeight;else hei=h
    // let param = { posX: window.innerWidth };
    let param = { posY: y - hei };
    function clickButton() {
        if (panel) {

            if (status == 0) {
                openPanel();
            }
            else if (status == 1) {
                closePanel()
            }

        } else {
            panel = document.createElement("IFRAME");
            panel.frameBorder = 0;
            panel.src = "/pages/analysis.html"
            panel.classList.add('slidePanel');
            panel.style.width = `${wid}px`;
            panel.style.height = `${hei}px`;
            panel.style.top = `${y}px`;
            panel.style.left = `${x}px`;
            document.body.appendChild(panel);
            window.analysisPanel=panel;
            panel.onload = function () {
                openPanel();
            }
        }


    }
    let to, fun;
    function openPanel() {
        to = 0;
        fun =  window.beginScheduledAnimations;
        status = 1;
        button.classList.add("active");
        createTween(panel, param, to, fun);
    }
    function closePanel() {
        to = - hei;
        fun = deletePanel;
        status = 0;
        button.classList.remove("active");
        createTween(panel, param, to, fun);
    }
    function deletePanel() {
        document.body.removeChild(panel);
        panel = null;
        window.analysisPanel=null;
    }
    function createTween(element, param, to, completeFun) {
        if (element.tween) element.tween.stop();
        element.tween = new TWEEN.Tween(param)
            .to({ posY: to }, 400)
            // .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function () {
                element.style.transform = `translateY(${param.posY}px)`;
            })
            .onComplete(function () {
                if (completeFun) completeFun();
            })
            .start();
    }

    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
    }
    animate();
    let result = {};
    result.getButton = function () {
        return button;
    }
    result.isOpen = function () {
        return status;
    }
    result.close = closePanel;
    result.hideButton = function hideSlidePanelButton() {
        button.style.opacity = "0";
        button.style.visibility = "hidden";
    }
    result.showButton = function showSlidePanelButton() {
        button.style.opacity = "1";
        button.style.visibility = "visible";
    }

   
    return result;
}

// function SlidePanel() {
//     this.getButton = null;
//     this.isOpen = null;
//     this.close = null;
//     this.hideButton = null;
//     this.showButton = null;
// }