
// const assert = require('assert');
const http = require('http');
const URLlib = require('url');
const path = require('path');
const fs = require('fs');


const CSVToJSON = require("csvtojson");
const JSONToCSV = require("json2csv").parse;
const QueryItem = require('./server/QueryItem.js');
const QueryData = require('./server/QueryData.js')

let server = http.createServer(function (req, res) {

    const { headers, method, url } = req;
    console.log(` ${method} ${url}`);

    const parsedUrl = URLlib.parse(url, true);
    req.parsedPath = decodeURI(parsedUrl.pathname);
    req.parsedUrl = parsedUrl;
    handle(req, res);


});
const port = process.env.PORT || 1337;
server.listen(port);
console.log(`Server running at  ${port}`);

//file handle-----------------------------------

function handle(req, res) {
    if (isFile(req.parsedPath)) {
        handleFile(req, res);
        return;
    }

    req.routeArr = splitRoute(req.parsedPath);
    routine[req.routeArr[1]](req, res);
}
function recievePostData(req, fun) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        console.log(body);
        fun(body);
        // res.end('ok');
    });

}
let routine = {
    "": function (req, res) {
        readFile("./index.html", function (result) {
            sendResult("text/html", result, res);
            // console.log("file read ok");
        })

    },
    "queryCsv": function (req, res) {
        recievePostData(req, parseQuery);
        function parseQuery(body) {
            let data = JSON.parse(body);
            CSVToJSON().fromFile("./data/samplefile.csv").then(searchQuery_Save_SendBack);
            function searchQuery_Save_SendBack(source) {
                //search
                let result = QueryData.search(source, data);
                //save
                let csv = JSONToCSV(result, {
                    fields: [
                        "FilingID",
                        "State",
                        "Filing Quarter",
                        "Dimensional Column",
                        "LoanCount",
                        "LoanAmount"
                    ]
                });
                fs.writeFileSync("./data/destination.csv", csv);
                //sendback
                res.setHeader('Content-type', 'application/json');
                res.end(JSON.stringify(result));
            }

        }
    },
    "getPullDownMenu": function (req, res) {
        let name = req.routeArr[2];
        QueryItem.get()
            .then(function sendBack(items) {
                res.setHeader('Content-type', 'application/json');
                res.end(JSON.stringify(items[name]));
            })

    },
    "getAnalysisData": function (req, res) {
        QueryItem.get()
            .then(computeValues);
        function computeValues(items) {
            CSVToJSON().fromFile("./data/samplefile.csv").then(queryEachQuarter);
            function queryEachQuarter(source) {
                let quarters = QueryData.sortQuarter(items.filings)
                let counts = [];
                let amounts = [];
                for (let i = 0; i < quarters.length; i++) {
                    let quarter = quarters[i];
                    let querydata = { state: [], dimension: [], filing: [quarter] }
                    result = QueryData.search(source, querydata);
                    let count = result[result.length - 1]["LoanCount"];
                    let amount = result[result.length - 1]["LoanAmount"];
                    counts.push(count);
                    amounts.push(amount);
                }
                sendBack([quarters, counts, amounts]);
            }


        }

        function sendBack(data) {
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify(data));
        }


    }

}

// class MyEmitter extends EventEmitter { }
function readFile(fullName, fun) {
    let result = {};
    fs.readFile(fullName, function (err, data) {
        if (err) {
            result = { "err": err };
        } else {
            result = { "ok": data };
        }
        fun(result);
    });
    return result;
}
function sendResult(type, result, res) {
    if (result.err) {
        res.statusCode = 500;
        res.end(`Error: can't read the file: ${result.err}.`);
        return null;
    } else {
        res.setHeader('Content-type', type);
        res.end(result.ok);
    }

}
function splitRoute(parsedPath) {
    let routeArr = parsedPath.split("/");
    return routeArr;
}
function isFile(filePathStr) {
    if (filePathStr.indexOf('.') == -1)
        return false;
    return true;
}
function handleFile(req, res) {
    let fileFullPath = `.${req.parsedPath}`;
    let fileName = req.parsedPath.slice(req.parsedPath.lastIndexOf("/") + 1);//req.parsedPath.lastIndexOf(".")
    getFileData(fileFullPath, req, res, function (data) {
        if (data == null)
            return;
        const mimeType = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.css': 'text/css',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.chart': 'image/chart+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.eot': 'appliaction/vnd.ms-fontobject',
            '.ttf': 'aplication/font-sfnt',
            '.csv': 'text/csv'
        };
        const ext = path.parse(fileFullPath).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.setHeader('fileName', fileName);
        res.end(data);
    });
}


function getFileData(file, req, res, fun) {
    if (!fs.existsSync(file)) {
        res.statusCode = 404;
        res.end(`Error: File ${file} not found!`);

    }
    fs.readFile(file, function (err, data) {
        if (err) {
            res.statusCode = 500;
            res.end(`Error: can't read the file: ${err}.`);

        } else {
            fun(data);
        }
    });
}
