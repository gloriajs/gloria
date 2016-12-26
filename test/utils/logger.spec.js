const expect = require('chai').expect;
const $log = require('../../lib/utils/logger');

describe('$log', () => {
    it('should report back when log function is called on mock logger', () => {
        expect(typeof $log.log).to.equal('function');
    });

    it('should report back when info function is called on mock logger', () => {
        expect(typeof $log.info).to.equal('function');
    });

    it('should report back when error function is called on mock logger', () => {
        expect(typeof $log.error).to.equal('function');
    });

});
