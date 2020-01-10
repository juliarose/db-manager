const types = require('./types');

module.exports = function(typeName, options = {}) {
    const type = types[typeName];
    
    options = Object.assign({
        nullAllowed: false,
        primaryKey: false
    }, options);
    
    if (type === undefined) {
        throw new Error(`Type with name "${typeName}" does not exist`);
    }
    
    return Object.assign({
        type
    }, options);
};