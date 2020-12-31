const { Rule, RequestRule, assert } = require('../lib')

class BaseAction {
  static get baseQueryParams () {
    return {
      page: new RequestRule(new Rule({
        validator: v => Number.isInteger(v) && v >= 0,
        description: 'Number; min 0;'
      })),
      limit: new RequestRule(new Rule({
        validator: v => Number.isInteger(v) && v > 1,
        description: 'Number; Limit min 2'
      })),
      orderBy: new RequestRule(new Rule({
        validator: v => typeof v === 'object',
        description: 'Object;'
      })),
      filter: new RequestRule(new Rule({
        validator: v => typeof v === 'object',
        description: 'Object;'
      })),
      schema: new RequestRule(new Rule({
        validator: v => typeof v === 'boolean',
        description: 'Boolean;'
      })),
      search: new RequestRule(new Rule({
        validator: v => typeof v === 'string',
        description: 'String;'
      })),
      searchFields: new RequestRule(new Rule({
        validator: v => typeof v === 'string',
        description: 'String;'
      }))
    }
  }

  static result (result) {
    assert.object(result, { notEmpty: true })
    assert.boolean(result.success)
    assert.integer(result.status)
    assert.array(result.cookies)
    assert.object(result.headers)
    assert.string(result.message)
    assert.ok(result.data)

    return {
      success: result.success || true,
      status: result.status || 200,
      ...(result.cookies && { cookies: result.cookies }),
      ...(result.headers && { headers: result.headers }),
      ...(result.message && { message: result.message }),
      ...(result.data && { data: result.data })
    }
  }

  static redirect (options) {
    assert.object(options, { required: true })
    assert.url(options.url, { required: true })
    assert.integer(options.code)

    return {
      redirect: {
        status: options.status || 301,
        url: options.url
      }
    }
  }
}

module.exports = { BaseAction }
