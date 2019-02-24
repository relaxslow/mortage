const http = require('http');
const URLlib = require('url');
const path = require('path');
const fs = require('fs');
let server = http.createServer(handle);
const port = process.env.PORT || 1337;
server.listen(port);
console.log(`Server running at  ${port}`);

function handle(req, res) {
    const { headers, method, url } = req;
    console.log(` ${method} ${url}`);

    const parsedUrl = URLlib.parse(url, true);
    req.parsedPath = decodeURI(parsedUrl.pathname);
    req.parsedUrl = parsedUrl;

    if (isFile(req.parsedPath)) {
        handleFile(req, res);
        return;
    }

    //req.routeArr = splitRoute(req.parsedPath);
    //routine[req.routeArr[1]](req, res);
}
function isFile(filePathStr) {
    if (filePathStr.indexOf('.') == -1)
        return false;
    return true;
}
function handleFile(req, res) {
    let fileFullPath = `.${req.parsedPath}`;
    let fileName = req.parsedPath.slice(req.parsedPath.lastIndexOf("/") + 1);
    getFileData(fileFullPath, res, function (data) {
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