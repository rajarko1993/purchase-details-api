const winston =  require('winston');

module.exports =  (err, req, res, next) => {
    console.log('err', err);
    console.log('errormessage', err.message);
    // winston.error(err.message, err);
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).send('INVALID CSRF TOKEN')
        // res.json(0);
        // return;
    } else {
        let statusCode = err.statusCode || 500
        res.status(statusCode).send(err.message);
        // return next();
    }
}