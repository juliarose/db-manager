const queriesMixin = require('./queries');
const pipe = require('../../../models/factory/utils/pipe');

module.exports = function(Model) {
    return pipe(Model, [
        queriesMixin
    ]);
}