process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const loaders = require('./loaders');
const express = require('express');

let startServer = async() => {
    const app = express();
    await loaders(app);
}

startServer();