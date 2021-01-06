require('dotenv').config();

const stdout = require('stdout-stream');
const chalk = require('chalk');

const config = require('./config');
const logger = require('./logger');

const schemas = require('./models');

const { Server, Mongoose } = require('./lib');

config
  .rootInit()
  .then(() => {
    return new Mongoose({
      schemas,
      mongoUriDb: config.mongoURI.db,
      logger
    })
      .then(() => {
        console.log('MongoDB Successfully Connected!');
      })
      .catch((error) => {
        stdout.write(chalk.blue(error.stack));
        logger.error('MongoDB fails to initialize...', error);
      });
  })
  .then(() => {
    const controllers = require('./controllers');
    const middlewares = require('./middlewares');
    const errorMiddleware = require('./middlewares/errorMiddleware');

    return new Server({
      port: Number(config.app.port),
      host: config.app.host,
      controllers,
      middlewares,
      errorMiddleware,
      cookieSecret: config.app.cookieSecret,
      logger
    });
  })
  .then((serverParams) => {
    logger.info('Server initialized...', serverParams);
    logger.debug('--- APP CONFIG ---');
    logger.debug(`HOST: ${config.app.host}`);
    logger.debug(`PORT: ${config.app.port}`);
    logger.debug(`NAME: ${config.app.name}`);
    logger.debug('--- TOKENS CONFIGS ---');
    logger.debug('REFRESH:', config.token.refresh);
    logger.debug('ACCESS:', config.token.access.clear());
    logger.debug('RESET PASSWORD:', config.token.resetPassword.clear());
    logger.debug('EMAIL CONFIRM:', config.token.emailConfirm.clear());
    logger.debug(`ISSUER: ${config.token.jwtIss}`);

    console.log(`Server up and running on port ${config.app.port} !`);
  })
  .catch((error) => {
    stdout.write(chalk.blue(error.stack));
    logger.error('Server fails to initialize...', error);
  });
