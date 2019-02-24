"getPullDownMenu": function (req, res) {
    let name = req.routeArr[2];
    QueryItem.get()
        .then(function sendBack(items) {
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify(items[name]));
        })

}