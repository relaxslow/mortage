function initOptions() {
    let req = new XMLHttpRequest();
    req.open('GET', `/getPullDownMenu/${elemtClass}`);
    req.onload = function () {
        let data = JSON.parse(req.response);
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            if (d === "") continue;
            let item = document.createElement('BUTTON');
            item.classList.add('optionItem');
            item.textContent = d;
            options.appendChild(item);

        }
        initItems();
        initResetBut();
        requestAnimationFrame(function () {
            initSelector();
        })
    }
    req.send();
}