const createModel = require('./factory/createModel');
const columndef = require('../../lib/models/data/columndef');

module.exports = createModel({
    table: 'items',
    columns: {
        defindex: columndef('int', {
            primaryKey: true
        }),
        item_name: columndef('string')
    }
});