req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
        var json = JSON.parse(req.responseText);
        buildTable(json);
        window.parent.resizeContent();
    }
};


// CSVToJSON().fromFile("./source.csv").then(source => {
//     source.push({
//         "sku": "34890",
//         "title": "Fortnite",
//         "hardware": "Nintendo Switch",
//         "price": "00.00"
//     });
//     let csv = JSONToCSV(source, { fields: ["sku", "title", "hardware", "price"] });
//     fs.writeFileSync("./destination.csv", csv);
// });

