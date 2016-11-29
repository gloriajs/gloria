var expect = require('chai').expect;
var Logger = require('../../lib/utils/logger').Logger;
var defaultLogger = require('../../lib/utils/logger').defaultLogger;

describe('Logger', () => {
    let logger;
    beforeEach(() => {
        logger = new Logger('logger.test');
    });
    it('should not have log, info and error functions if Logger has empty parameter', () => {
        let erroneousLogger = () => {
            const defaultLogger = new Logger();
        };
        let expectedError = new Error('file name should be string.');
        expect(erroneousLogger).to.throw(Error);
    });
    it('should report back appropriate message when log function is called', () => {
        expect(typeof logger.log).to.equal('function');
        logger.setProcedure('case');
        expect(logger.log()).to.contain('log');
        expect(logger.log('x')).to.contain(' - logger.test - case -  - x -  - ');
        expect(logger.log('x', 'y', 'z')).to.contain(' - logger.test - case -  - x - "y" - z');
    });
    it('should report back appropriate message when info function is called', () => {
        expect(typeof logger.info).to.equal('function');
        logger.setProcedure('case');
        expect(logger.info()).to.contain('info');
        expect(logger.info('x')).to.contain(' - logger.test - case -  - x -  - ');
        expect(logger.info('x', 'y', 'z')).to.contain(' - logger.test - case -  - x - "y" - z');
    });
    it('should report back appropriate message when error function is called', () => {
        expect(typeof logger.error).to.equal('function');
        logger.setProcedure('case');
        expect(logger.error()).to.contain('error');
        expect(logger.error('x')).to.contain(' - logger.test - case -  - x -  - ');
        expect(logger.error('x', 'y', 'z')).to.contain(' - logger.test - case -  - x - "y" - z');
    });
});
