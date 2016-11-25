class Logger {
    constructor(file, logger) {
        if (typeof file !== 'string') {
            throw new Error('file name should be string.');
        }
        this.file = file;
        this.logger = logger || console;
    }
    setProcedure(proc) {
        if (typeof proc !== 'string') {
            throw new Error('procedure name should be string.');
        }
        this.procedure = proc;
        return this;
    }
    setLine(line) {
        this.line = line;
        return this;
    }
    getLogString(name, value, comment, type, separator) {
        let by = separator || ' - ';
        return [type, Date.now(), this.file, this.procedure, this.line, name, JSON.stringify(value), comment].join(by);
    }
    log(name, value, comment) {
        let logString = this.getLogString(name, value, comment, 'log');
        this.logger.log(logString);
        return logString;
    }
    info(name, value, comment) {
        let logString = this.getLogString(name, value, comment, 'info');
        this.logger.log(logString);
        return logString;
    }
    error(name, value, comment) {
        let logString = this.getLogString(name, value, comment, 'error');
        this.logger.log(logString);
        return logString;
    }
}

module.exports = {
    Logger: Logger,
};
