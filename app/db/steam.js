const createDatabase = require('../../lib/db/factory/createDatabase');
const path = require('path');
const cwd = process.cwd();
const credentialsPath = path.join(cwd, 'config/mysql/steam/credentials.json');
const schemaPath = path.join(cwd, 'config/mysql/steam/schema.json');
const timePath = path.join(cwd, 'config/mysql/time.json');
const {timezone} = require(timePath);

module.exports = createDatabase({credentialsPath, schemaPath, timezone});