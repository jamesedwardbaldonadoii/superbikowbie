const { BaseMiddleware } = require('../rootcommmon/BaseMiddleware')
const logger = require('../logger')

class QueryMiddleware extends BaseMiddleware {
  async init () {
    logger.debug(`${this.constructor.name} initialized...`)
  }

  handler () {
    return async (req, res, next) => {
      // set default query
      req.query = req.method === 'GET' ? {
        ...req.query,
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 2,
        filter: req.query.filter || {},
        fields: req.query.fields || '',
        orderBy: req.query.orderBy ? JSON.parse(req.query.orderBy) : { createdAt: 'asc' }
      } : { ...req.query }

      next()
    }
  }
}

module.exports = { QueryMiddleware }
