const escape = require('../../../db/utils/escape');

module.exports = {
    getInsertValues() {
        return Object.keys(this.constructor.columns).map((columnName) => {
            return this[columnName];
        });
    },
    insert() {
        const {database} = this.constructor;
        const columnNames = Object.keys(this.constructor.columns);
        const values = this.getInsertValues();
        const queryStr = [
            `INSERT INTO ${escape.field(this.constructor.table)}`,
            `(${columnNames.map(escape.field).join(', ')})`,
            `VALUES (${values.map(escape.value).join(', ')})`
        ].join(' ');
        
        return database.query(queryStr);
    },
    update() {
        const changedKeys = Object.keys(this.options.changes);
        
        if (changedKeys.length === 0) {
            return Promise.reject('No changes to commit');
        }
        
        const {database} = this.constructor;
        const primaryKey = this.constructor.primaryKey;
        const changes = changedKeys.map((key) => {
            return `${escape.field(key)} = ${escape.value(this[key])}`;
        });
        const queryStr = [
            `UPDATE ${escape.field(this.constructor.table)}`,
            `SET ${changes.join(', ')}`,
            `WHERE ${escape.field(primaryKey)} = ${escape.value(this[primaryKey])}`
        ].join(' ');
        
        return database.query(queryStr);
    },
    save() {
        if (this.options.exists) {
            return this.update();
        }
        
        return this.insert();
    }
};