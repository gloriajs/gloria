var expect = require('chai').expect;
var Logger = require('../../lib/utils/logger').Logger;
var defaultLogger = require('../../lib/utils/logger').defaultLogger;

describe('Logger', () => {
    const mockLogger = {
        log: x => 'mockLogger.log was called with ' + x,
        info: x => 'mockLogger.info was called with ' + x,
        error: x => 'mockLogger.error was called with ' + x,
    };

    let logger;
    beforeEach(() => {
        logger = new Logger(mockLogger);
    });
    it('should not have log, info and error functions if Logger has empty parameter', () => {
        const defaultLogger = new Logger();
        expect(defaultLogger.log).to.equal(undefined);
        expect(defaultLogger.info).to.equal(undefined);
        expect(defaultLogger.error).to.equal(undefined);
    });
    it('should report back when log function is called on mock logger', () => {
        expect(typeof logger.log).to.equal('function');
        expect(logger.log('logging mock')).to.equal('mockLogger.log was called with logging mock');
    });
    it('should report back when info function is called on mock logger', () => {
        expect(typeof logger.info).to.equal('function');
        expect(logger.info('logging mock')).to.equal('mockLogger.info was called with logging mock');
    });
    it('should report back when error function is called on mock logger', () => {
        expect(typeof logger.error).to.equal('function');
        expect(logger.error('logging mock')).to.equal('mockLogger.error was called with logging mock');
    });
});
