function addResizeListener(elem, fun) {
    let id;
    let style = getComputedStyle(elem);
    let wid = style.width;
    let hei = style.height;
    id = requestAnimationFrame(test);
    function test() {
        let newStyle = getComputedStyle(elem);
        if (wid !== newStyle.width ||
            hei !== newStyle.height) {
            fun();
            wid = newStyle.width;
            hei = newStyle.height;
        }
        id = requestAnimationFrame(test);
    }
}