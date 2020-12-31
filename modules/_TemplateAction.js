const { BaseAction } = require('./../rootcommmon/BaseAction');

class TemplateAction extends BaseAction {
  static get accessTag () {
    return 'template:template';
  }

  static get validationRules () {
    return {
      params: {},
      query: {
        ...this.baseQueryParams
      },
      body: {
      }
    };
  }

  static run (ctx) {
    return this.result({});
  }
}

module.exports = { TemplateAction };
