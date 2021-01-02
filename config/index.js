const mongoURI = require('./mongoURI');
const folders = require('./folders');
const token = require('./token');
const email = require('./email');
const app = require('./app');

const asyncConfigs = [app, token, email];

function rootInit () {
  return new Promise(async (resolve, reject) => {
    for (const config of asyncConfigs) {
      try {
        await config.init();
      } catch (e) {
        return reject(e);
      }
    }
    resolve();
  });
}

module.exports = {
  app,
  folders,
  token,
  email,
  mongoURI,
  rootInit
};
