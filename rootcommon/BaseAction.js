const Joi = require('joi');
const { assert } = require('../lib');

class BaseAction {
  static get baseQueryParams () {
    return {
      page: Joi.number().min(0),
      limit: Joi.number().min(5),
      orderBy: Joi.object(),
      filter: Joi.object(),
      schema: Joi.boolean(),
      search: Joi.string().allow(null, ''),
      searchFields: Joi.string().allow(null, '')
    };
  }

  static result (result) {
    assert.object(result, { notEmpty: true });
    assert.boolean(result.success);
    assert.integer(result.status);
    assert.array(result.cookies);
    assert.object(result.headers);
    assert.string(result.message);
    assert.ok(result.data);

    return {
      success: result.success || true,
      status: result.status || 200,
      ...(result.cookies && { cookies: result.cookies }),
      ...(result.headers && { headers: result.headers }),
      ...(result.message && { message: result.message }),
      ...(result.data && { data: result.data })
    };
  }

  static redirect (options) {
    assert.object(options, { required: true });
    assert.url(options.url, { required: true });
    assert.integer(options.code);

    return {
      redirect: {
        status: options.status || 301,
        url: options.url
      }
    };
  }
}

module.exports = { BaseAction };
