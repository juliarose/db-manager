const columndef = require('../../models/data/columndef');

module.exports = function(table, describes) {
    const describeColumn = (column) => {
        const dbColumnType = column.Type.match(/^\w+/)[0];
        const primaryKey = column.Key === 'PRI';
        const nullAllowed = column.Null !== 'NO';
        
        return columndef(dbColumnType, {
            primaryKey,
            nullAllowed
        });
    };
    const columns = describes.reduce((columns, column) => {
        columns[column.Field] = describeColumn(column);
        
        return columns;
    }, {});
    
    return {
        table,
        columns
    };
};