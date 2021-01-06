const express = require('express');
const router = express.Router();

const { BaseController } = require('../../rootcommon/BaseController');
const RootProvider = require('../RootProvider');

class RootController extends BaseController {
  get router () {
    router.get('/', (req, res) => {
      res.send('API OK! (>___<)');
    });

    return router;
  }

  async init () {
    this.logger.debug(`${this.constructor.name} initialized...`);
    await RootProvider.init();
  }
}

module.exports = { RootController };
