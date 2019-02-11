let downloadButton = document.querySelector(".download");
downloadButton.addEventListener("click", clickDownLoad);
function clickDownLoad(evt) {
    // window.open("/test.txt");
    //-------------------------------------------
    downloadFile("/data/destination.csv");
}
function downloadFile(urlToSend) {
    let req = new XMLHttpRequest();
    req.open("GET", urlToSend, true);
    req.responseType = "blob";
    req.onload = function (event) {
        let blob = req.response;
        let fileName = req.getResponseHeader("fileName") //if you have the fileName header available
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setTimeout(function () {
            window.URL.revokeObjectURL(link.href);
        }, 1000);
    };

    req.send();
}

let listButton = document.querySelector(".listAll");
listButton.addEventListener("click", clickList);
function clickList() {
    query();
    // readCsv("/source.csv");
}
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

let table;
let queryResult = document.querySelector(".queryResult");
function buildTable(json) {
    if (table) queryResult.removeChild(table);
    table = document.createElement("TABLE");
    queryResult.appendChild(table);
    let caption = document.createElement("CAPTION");
    if (json.length == 1) {
        caption.textContent = "no found"
    }
    else {
        caption.textContent = "list all"
    }
    table.appendChild(caption);
    let headRow = document.createElement("TR");
    table.appendChild(headRow)
    for (let key in json[0]) {
        let head = document.createElement("TH");
        headRow.appendChild(head);
        head.textContent = key;
    }
    for (let i = 0; i < json.length; i++) {
        let row = document.createElement("TR");
        table.appendChild(row)
        let record = json[i];
        for (let key in record) {
            let cell = document.createElement("TD");
            row.appendChild(cell);
            cell.textContent = record[key];
        }
    }
    window.parent.resizeContent();
}

let filings = getPullDown("filings");
let states = getPullDown("states");
let dimensions = getPullDown("dimensions");