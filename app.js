
// const assert = require('assert');
const http = require('http');
const URLlib = require('url');
const path = require('path');
const fs = require('fs');

var server = http.createServer(function (req, res) {

    const { headers, method, url } = req;
    console.log(` ${method} ${url}`);

    const parsedUrl = URLlib.parse(url, true);
    req.parsedPath = decodeURI(parsedUrl.pathname);
    req.parsedUrl = parsedUrl;

    
    if (isFile(req.parsedPath))
        handleFile(req, res);
    // else
    //     handleRoutine(req, res);

});
const port = process.env.PORT || 1337;
server.listen(port);
console.log(`Server running at  ${port}`);

//file handle-----------------------------------
function isFile(filePathStr) {
    if (filePathStr.indexOf('.') == -1)
        return false;
    return true;
}
function handleFile(req, res) {
    let fileFullPath = `.${req.parsedPath}`;

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
            '.ttf': 'aplication/font-sfnt'
        };
        const ext = path.parse(fileFullPath).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain');
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
