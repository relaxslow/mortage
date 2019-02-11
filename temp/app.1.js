
// const assert = require('assert');
const http = require('http');
const URLlib = require('url');
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');


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

    let parsedPath = req.parsedPath;
    let method = req.method;
    let routeArr = splitRoute(parsedPath);
    routine[routeArr[1]](req, res);
}
let routine = {
    "": function (req, res) {
        readFile("./index.html", function (result) {
            sendResult("text/html", result, res);
            // console.log("file read ok");
        })

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
    if (result[0] === "err") {
        res.statusCode = 500;
        res.end(`Error: can't read the file: ${result[1]}.`);
        return null;
    } else {
        res.setHeader('Content-type', type);
        // res.download('./text.txt');
        res.end(result[1]);
    }

}
function splitRoute(parsedPath) {
    let routeArr = parsedPath.split("/");
    if (routeArr[routeArr.length - 1] != "")
        routeArr.push("");
    return routeArr;
}
function isFile(filePathStr) {
    if (filePathStr.indexOf('.') == -1)
        return false;
    return true;
}
function handleFile(req, res) {
    let fileFullPath = `.${req.parsedPath}`;
    let fileName=req.parsedPath.slice(req.parsedPath.lastIndexOf("/")+1);//req.parsedPath.lastIndexOf(".")
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
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.eot': 'appliaction/vnd.ms-fontobject',
            '.ttf': 'aplication/font-sfnt',
            '.csv': 'text/csv'
        };
        const ext = path.parse(fileFullPath).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
        res.setHeader('fileName',fileName);
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
