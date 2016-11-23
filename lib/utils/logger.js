'use strict';

function Logger(logger) {
  if (logger && logger.log && logger.info && logger.error) {
    this.log = logger.log.bind(this);
    this.info = logger.info.bind(this);
    this.error = logger.error.bind(this);
  }
}

module.exports = {
  Logger: Logger
};
