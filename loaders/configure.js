const config = require('config').get('Common');
const _ = require('underscore');
module.exports = async (global) => {
    // global.paths = config;
    global.common = config;
    global.surl = config.get('url');
    global.port = config.get('port');
    if(process.env.NODE_ENV == 'development') {
      global.url  = global.surl+':'+global.port;
    } else {
      global.url  = global.surl;
    }
    global.logourl  = global.url;
    global.spath = global.url+'/';
    global.dpath = global.spath;
    return global;
}
