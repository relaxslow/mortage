function readCsv(file) {
    let req = new XMLHttpRequest();
    req.open('GET', "/opencsv/" + "?data=" + encodeURIComponent(file));
    // req.setRequestHeader("Content-Type", "application/json");
    req.onload = function () {
        var json = JSON.parse(req.responseText);
        buildTable(json);
        window.parent.resizeContent();
    }

    req.send();

}