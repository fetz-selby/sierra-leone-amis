require('dotenv').config();
var Sequelize = require('sequelize');

const config = {
    IP : process.env.SERVER_IP,
    HTTP_SERVER_PORT : process.env.HTTP_LOCAL_PORT || 8001,
    HTTPS_SERVER_PORT : process.env.HTTPS_LOCAL_PORT || 8443,
    secret : 'thequickfoxjumpedoverthelazydog',
    prepare : false
}

const sequelize = new Sequelize(process.env.DB_NAME || 'HEALTHERA_TEST', process.env.DB_USER || 'healthera_admin', process.env.DB_PASSWORD || 'pa55w0rd', {
    host: process.env.DB_HOST || 'localhost',
    //dialect: 'postgres',
    dialect: process.env.DB_DIALECT || 'mysql',
    pool: {
        max: 1,
        min: 0,
        idle: 10000,
        acquire: 20000,
        handleDisconnects: true
    }
});

module.exports = {config : config, sequelize : sequelize};