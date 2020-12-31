const actions = require('../actions')
const { startCase } = require('lodash')

const update = {
  api: '/users',
  method: 'PATCH',
  fields: Object.keys(actions.UpdateUserAction.validationRules.body),
  btnText: 'Update',
  showEditor: true
}

const password = []

Object.keys(actions.UpdateUserPasswordAction.validationRules.body).forEach(i => {
  password.push({
    description: '',
    disabled: false,
    form: i === 'id' ? 'text' : 'password',
    format: 'string',
    key: i,
    placeholder: `Enter your ${startCase(i)}`,
    required: true,
    title: startCase(i),
    id: i === 'id'
  })
})

module.exports = {
  create: {
    api: '/users',
    method: 'POST',
    fields: Object.keys(actions.CreateUserAction.validationRules.body),
    btnText: 'Create'
  },
  update,
  list: {
    api: '/users',
    method: 'GET',
    fields: ['firstname', 'lastname', 'suffix', 'username', 'email', 'role'], // including virtuals created
    limit: 5,
    limits: [5, 10, 20, 30, 50, 100],
    operations: [
      {
        ...update,
        btnText: 'Update',
        btnIcon: 'write'
      },
      {
        api: '/users',
        params: ['id'],
        method: 'DELETE',
        fields: [], // select the fields base on the validation rules body of UpdateUserAction
        btnIcon: 'bin',
        promptCofirm: true,
        promptCofirmText: 'Are you sure you want to delete this user?',
        promptCofirmTitle: 'Confirm Delete'
      },
      {
        api: '/users/block',
        params: ['id'],
        method: '',
        fields: [''], // select the fields base on the validation rules body of UpdateUserAction
        btnIcon: 'blocked'
      },
      {
        api: '/users/change-employee-password',
        method: 'POST',
        isCustom: true, // use this fields instead from the schema
        fields: password,
        btnIcon: 'lock',
        btnText: 'Update Password',
        showEditor: true
      }
    ]
  },
  bulk: [
    {
      ...update,
      method: 'POST',
      fields: ['id', 'role'],
      api: '/users/bulk.update',
      btnIcon: 'write',
      btnText: 'Update users'
    },
    {
      api: '/users/bulk.delete',
      isDelete: true,
      fields: Object.keys(actions.BulkDeleteUserAction.validationRules.body),
      method: 'POST',
      promptCofirm: true,
      btnText: 'Delete users',
      btnIcon: 'bin',
      promptCofirmText: 'Are you sure you want to delete all these selected users?',
      promptCofirmTitle: 'Confirm Delete'
    },
    {
      api: '/users/bulk.block',
      fields: ['id'],
      method: 'POST',
      btnText: 'Block users',
      btnIcon: 'blocked',
      promptCofirm: true,
      promptCofirmText: 'Are you sure you want to block all these selected users?',
      promptCofirmTitle: 'Confirm Block'
    }
  ]
}
