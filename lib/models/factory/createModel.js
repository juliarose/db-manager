const {singular} = require('pluralize');
const recordsProto = require('./proto/records');
const pipe = require('../../models/factory/utils/pipe');

module.exports = function({table, columns}, mixins = []) {
    const modelName = (function() {
        const words = table
            .split('_')
            .map((word) => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            });
        
        // singularize the last word
        words[words.length - 1] = singular(words[words.length - 1]);
        
        return words.join('');
    }());
    const primaryKey = (function() {
        const primaryColumn = Object.entries(columns)
            .find(([columnName, column]) => {
                return Boolean(column.primaryKey);
            });
        
        if (!primaryColumn) {
            return undefined;
        }
        
        const [columnName] = primaryColumn;
        
        return columnName;
    }());
    
    function Model(data, options = {}) {
        options.changes = {};
        
        Object.assign(this, {
            // this will strip prototype methods from data object
            attributes: Object.assign({}, data),
            options
        });
    }
    
    // name it after the table
    Object.defineProperty(Model, 'name', {
        value: modelName
    });
    
    Object.assign(Model.prototype, recordsProto);
    
    Object.defineProperty(Model.prototype, 'primaryValue', {
        get() {
            if (primaryKey === undefined) {
                return undefined;
            }
            
            return this[primaryKey];
        }
    });
    
    Object.entries(columns).forEach(([columnName, column]) => {
        Object.defineProperty(Model.prototype, columnName, {
            get() {
                return this.attributes[columnName];
            },
            set(value) {
                const isNullWhenNotAllowed = Boolean(
                    value == null &&
                    !column.nullAllowed
                );
                const isCorrectType = Boolean(
                    Array.isArray(column.type) ?
                    column.type.includes(typeof value) :
                    typeof value === column.type
                );
                const changed = Boolean(
                    this.attributes[columnName] !== value
                );
                
                if (isNullWhenNotAllowed) {
                    throw new Error(
                        `Attempting to set null value to column "${columnName}" ` +
                        'which must not be null'
                    );
                }
                
                if (!isCorrectType) {
                    throw new Error(
                        `Attempting to set value to column "${columnName}" ` +
                        `which must be of type "${column.type}"`
                    );
                }
                
                if (changed) {
                    this.options.changes[columnName] = true;
                    
                    this.attributes[columnName] = value;
                }
            }
        });
    });
    
    // class methods
    return pipe(Model, [
         ...mixins,
         function() {
            return {
                table,
                columns,
                primaryKey
            };
        }
    ]);
};