const expressLoader = require('./express');
const mysqlLoader = require('./mysql');
const routesLoader = require('./routes');
const configureLoader = require('./configure');
const connectionLoader = require('./connection');

module.exports = async(app) => {
    global = await mysqlLoader()
    $arr = {
        config: await configureLoader(global)
    };
    await expressLoader(app);
    await routesLoader(app);
    await connectionLoader(app);
}