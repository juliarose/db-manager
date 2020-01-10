const dbMixin = require('../../../../lib/models/factory/mixins/db');
const pipe = require('../../../../lib/models/factory/utils/pipe');
const steamdb = require('../../../db/steam');

module.exports = function(Model) {
    const steamDbMixin = function() {
        return {
            database: steamdb
        };
    };
    
    return pipe(Model, [
        dbMixin,
        steamDbMixin
    ]);
};