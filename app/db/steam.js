const createDatabase = require('../../lib/db/factory/createDatabase');
const getSettings = require('../../lib/db/factory/utils/getSettings');
const path = require('path');
const credentials = (function() {
    const cwd = process.cwd();
    const credentialsPath = path.join(cwd, 'config/mysql/steam/credentials.json');
    const timePath = path.join(cwd, 'config/mysql/time.json');
    const {timezone} = require(timePath);
    const steamDbCredentials = require(credentialsPath);
    
    return getSettings(Object.assign(steamDbCredentials, {timezone}));
}());

module.exports = createDatabase(credentials);