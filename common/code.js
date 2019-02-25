
function format(code, fun) {
    let fileName = code.dataset.file;
    if (!fileName) return;
    let req = new XMLHttpRequest();
    req.open('GET', `/getFormattedCode/${fileName}`)
    req.onload = codeRecieved;
    req.send();
    function codeRecieved() {
       
        // Options for the observer (which mutations to observe)
        let config = { attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        let  callback = function (mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                     fun();
//                     console.log('A child node has been added or removed.');
                    observer.disconnect();
                }
                else if (mutation.type == 'attributes') {
//                     console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
        };

        // Create an observer instance linked to the callback function
        let  observer = new MutationObserver(callback);
        observer.observe(code, config);

        code.innerHTML = req.response;
       


    }

    enableDrag(code);

}
function enableDrag(code) {
    code.addEventListener('pointerdown', mousedownCode);
    code.addEventListener('pointerour', mouseLeaveCode);
    code.addEventListener('pointerup', mouseUpCode);
    code.addEventListener('pointermove', mousemoveCode);
    let isDown = false;
    let startX;
    let scrollLeft;
    function mousedownCode(e) {
        isDown = true;
        code.classList.add('active');
        startX = e.pageX - code.offsetLeft;
        scrollLeft = code.scrollLeft;

    }
    function mouseLeaveCode(e) {
        isDown = false;
        code.classList.remove('active');

    }
    function mouseUpCode(e) {
        isDown = false;
        code.classList.remove('active');

    }
    function mousemoveCode(e) {
        if (!isDown) return;
        // e.preventDefault();
        const x = e.pageX - code.offsetLeft;
        const offset = (x - startX) * 3; //scroll-fast
        code.scrollLeft = scrollLeft - offset;

    }
}

