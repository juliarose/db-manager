const winston = require('winston');
const {createLogger, format, transports} = winston;
const {combine, printf, timestamp} = format;
const levels = { 
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    query: 5,
    debug: 6
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    query: 'cyan',
    debug: 'blue'
};
const myFormat = printf(({level, message}) => {
    return `${level}: ${message}`;
});

winston.addColors(colors);

module.exports = createLogger({
    levels,
    level: 'query',
    format: combine(
        format.colorize(),
        myFormat
    ),
    transports: [
        new transports.Console({
            name: 'console',
            colorize: true,
            level: 'query'
        })
    ]
});
 