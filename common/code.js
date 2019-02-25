
function format(code, fun) {
    let fileName = code.dataset.file;
    if (!fileName) return;
    let req = new XMLHttpRequest();
    req.open('GET', `/getFormattedCode/${fileName}`)
    req.onload = codeRecieved;
    req.send();
    function codeRecieved() {
        // code.addEventListener('click', finishLoadCode)
        code.innerHTML = req.response;
        // code.click();//wait full rendered
        fun();


    }

    // function finishLoadCode() {
    //     fun();
    // }
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

