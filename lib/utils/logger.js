const defaultLoggers = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    time: console.time,
    timeEnd: console.timeEnd,
    profile: () => '',
};

const logger = defaultLoggers;

logger.verbose = Object.assign({}, defaultLoggers);

logger.silent = function () {
    logger.log = () => '';
    logger.info = () => '';
};

module.exports = logger;
