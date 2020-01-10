module.exports = {
    field(value) {
        if (value == null) {
            return 'NULL';
        } else if (typeof value === 'string') {
            return '`' + value.replace(/`/g, '') + '`';
        }
        
        return value;
    },
    value(value) {
        if (value == null) {
            return 'NULL';
        } else if (typeof value === 'string') {
            return `'${value.replace(/'/g, '\'\'')}'`;
        }
        
        return value;
    }
};