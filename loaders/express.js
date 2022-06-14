    // var newrelic = require('newrelic');
require('express-async-errors');
const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = async (app) => {
    app.use(express.static(path.join(__dirname, '../public')));
    
    app.use(cors());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

    return app;
};
