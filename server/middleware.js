const cookieParser = require('cookie-parser');

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

module.exports = { logger, cookieParser };