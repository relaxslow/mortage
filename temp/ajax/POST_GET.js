function query() {
    let query = {
        state: states.getCurrentSelect(),
        filing: filings.getCurrentSelect(),
        dimension: dimensions.getCurrentSelect()
    }
    let req = new XMLHttpRequest();

    req.open('POST', "/queryCsv/");
    req.setRequestHeader("Content-type", "application/json");
    req.onload = function () {
        var json = JSON.parse(req.responseText);
        buildTable(json);
    }
    data = JSON.stringify(query);
    req.send(data);

}

function initOptions() {
    let req = new XMLHttpRequest();
    req.open('GET', `/getPullDownMenu/${elemtClass}`);
    req.onload = function () {
        let data = JSON.parse(req.response);
        for (let i = 0; i < data.length; i++) {
            let item = document.createElement('BUTTON');
            item.classList.add('optionItem');
            item.textContent = data[i];
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