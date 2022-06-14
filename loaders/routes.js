module.exports = function(app) {
    var cors = require('cors');
    app.use(cors());
    
    var api = require('../routes/api/index'),
    error = require('../middleware/error');
    app.use('/api', api);
    app.use(error);

    return app;
}