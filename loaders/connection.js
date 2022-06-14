const http = require('http');
const port = require('config').get('Common').get('port');
module.exports = async(app) => {
    var server = http.createServer(app).listen(port);
    server.setTimeout(540000);
    console.log('site up and running on port: ' + port);

    return app;
};