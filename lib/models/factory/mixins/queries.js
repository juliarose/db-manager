const escape = require('../../../db/utils/escape');

module.exports = function(Model) {
    return {
        query(queryStr) {
            return Model.database.query(queryStr)
                .then((rows) => {
                    return rows.map((row) => {
                        return new Model(row, {
                            exists: true
                        });
                    });
                }); 
        },
        where(whereQueryStr) {
            const queryStr = [
                `SELECT * FROM ${escape.field(Model.table)} WHERE`,
                whereQueryStr
            ].join(' ');
            
            return Model.query(queryStr);
        },
        get(value) {
            const whereQueryStr = [
                `${escape.field(Model.primaryKey)} = ${escape.value(value)}`,
                'LIMIT 1'
            ].join(' ');
            
            return Model.where(whereQueryStr)
                .then((records) => {
                    return records[0];
                });
        },
        all() {
            const queryStr = `SELECT * FROM ${escape.field(Model.table)}`;
            
            return Model.query(queryStr); 
        }
    };
};