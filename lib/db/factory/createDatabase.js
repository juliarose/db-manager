const mysql = require('mysql');
const logger = require('../../logger');
const transformDescribe = require('../utils/transformDescribe');

function createDatabase(settings) {
    const connect = () => {
        return new Promise((resolve, reject) => {
            connection.connect((error) => {
                if (error) {
                    reject(error);
                } else {
                    logger.log('info', `Connected to database: ${database.database}`);
                    resolve();
                }
            });
        });
    };
    const connection = mysql.createConnection(settings);
    const database = {
        // object to hold schema
        schema: {},
        database: settings.database,
        query(queryStr) {
            logger.log('query', queryStr);
            
            return new Promise((resolve, reject) => {
                connection.query(queryStr, (error, rows) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(rows);
                    }
                });
            });
        },
        // this should only be called once
        setup() {
            return connect()
                .then(() => {
                    database.setup = function() {
                        // re-assign to throw an error if setup  is called again
                        throw new Error(`Setup for ${database.database} was already called`);
                    };
                    
                    return database;
                });
        },
        getModels(createModel) {
            return database.query('SHOW TABLES')
                .then((tables) => {
                    const tableNames = tables.map((table) => {
                        return table['Tables_in_' + database.database];
                    });
                    const describePromises = tableNames.map((tableName) => {
                        return database.query('DESCRIBE `' + tableName + '`');
                    });
                    
                    return Promise.all(describePromises)
                        .then((describes) => {
                            return describes.map((describe, i) => {
                                const options = transformDescribe(tableNames[i], describe);
                                
                                return createModel(options);
                            });
                        })
                        .then((models) => {
                            const schema = models.reduce((schema, model) => {
                                schema[model.name] = model;
                                
                                return schema;
                            }, {});
                            
                            // update the schema
                            database.schema = schema;
                            
                            return schema;
                        });
                });
        }
    };
    
    connection.on('error', (error) => {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            logger.log('warn',  `MySQL error: ${error.message}`);
            
            connect();
        } else {
            throw error;
        }
    });
    
    return database;
}

module.exports = createDatabase;