const app = require('./app');
const steamdb = require('./app/db/steam');
const createModel = require('./app/models/factory/createModel');
const logger = require('./lib/logger');

app.setup(steamdb)
    // load the models from the database
    .then((db) => {
        return db.getModels(createModel);
    })
    // get some data
    .then(({Item}) => {
        // query all records
        return Item.all()
            .then((items) => {
                const lastIndex = items.length - 1;
                
                return items[lastIndex].primaryValue;
            })
            // get one
            .then(Item.get)
            .then(({item_name}) => {
                console.log(item_name);
            });
    })
    .catch((error) => {
        if (error.sqlMessage) {
            logger.log('error', error.sqlMessage);
        } else {
            console.log(error);
        }
        
        process.exit(0);
    });