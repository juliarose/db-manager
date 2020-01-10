const createModel = require('../../../lib/models/factory/createModel');
const steamdbMixin = require('./mixins/steamdb');

module.exports = function(options, mixins = []) {
    return createModel(options, [
        steamdbMixin,
        ...mixins
    ]);
};