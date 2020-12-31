// const { EmailAgent } = require('../agents')
// const config = require('../config')
const logger = require('../logger');

class RootProvider {
  constructor () {
    console.log('ROOT PROVIDER');
  }
  async init () {
    logger.debug(`${this.constructor.name} initialized...`);
  }
}

module.exports = new RootProvider();
