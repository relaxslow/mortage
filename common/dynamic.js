function addCss(win, file) {
    let cssLink = document.createElement("link");
    cssLink.setAttribute("rel", "stylesheet");
    cssLink.setAttribute("type", "text/css");
    cssLink.setAttribute("href", file);
    win.document.getElementsByTagName("head")[0].appendChild(cssLink);

    let tasks = [];
    cssLink.addtask = function (fun) {
        tasks.push(fun);
    }
    cssLink.onload = function (evt) {
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            task();
        }
        tasks.length = 0;
    };
    return cssLink;
}