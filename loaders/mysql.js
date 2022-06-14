const mysql = require('mysql');
const util = require('util')
const config = require('config').get('Common').get('dbConfig');

module.exports = async () => {
    delete global;
    global = [];
    global.dbconfig = {
      connectionLimit: 120,
      host : config.host,
      user : config.user,
      password: config.password,
      database: config.database,
      multipleStatements: true
    };
    let handleDisconnect = () =>  {
      global.connect = mysql.createPool(global.dbconfig);
      global.connect.getConnection((err, connection) => {
        if (err) {
          console.log('mySQLPool Error', err, err.message); 
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
                handleDisconnect();
            } else if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.');
                handleDisconnect();
            } else if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.');
                handleDisconnect();
            } else if (err.code === 'ETIMEDOUT') {
              console.error('Database Error Timed out');
              handleDisconnect();
            } else {
              console.error('Database Error Unknown', err);
            }
        }
        if (connection) connection.release()
        return
      })
      global.connect.query = util.promisify(global.connect.query)
      global.mysql =  global.connect;
    }
    handleDisconnect();

    global.dbconfigsingle = {
      host : config.host,
      user : config.user,
      password: config.password,
      database: config.database
    };
    let handleDisconnectSingle = () =>  {
      global.connectsingle = mysql.createConnection(global.dbconfigsingle);

      global.connectsingle.connect(function(err) {
        if (err) {
            console.error("[" + new Date() + "] --> DB CONNECTION Failed :", err.code);
            handleDisconnectSingle();
        }
      });
      global.connectsingle.on('close', function (err) {
        handleDisconnectSingle();
      });
      global.connectsingle.on('end', function (err) {
        handleDisconnectSingle();
      });
      global.connectsingle.on('error', function(err) {
        if(err.fatal || err.code == 'PROTOCOL_CONNECTION_LOST'){
          console.error("[" + new Date() + '] --> DB FATAL/PROTOCOL_CONNECTION_LOST ERROR :',err);
          global.connectsingle.end();
        }
      });
      global.connectsingle.query = util.promisify(global.connectsingle.query)
      global.mysqlsingle = global.connectsingle;
    }
    handleDisconnectSingle();
    
    return global;
}
