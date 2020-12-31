const { assert } = require('../../../lib')
const { RefreshSessionDAO } = require('../../../dao/RefreshSessionDAO')
const { RefreshSessionEntity } = require('./RefreshSessionEntity')
// const { UserModel } = require('../../../models/UserModel')

const MAX_REFRESH_SESSIONS_COUNT = 5

async function addRefreshSession (refreshSession) {
  assert.instanceOf(refreshSession, RefreshSessionEntity)

  if (await _isValidSessionsCount(refreshSession.user)) {
    await _addRefreshSession(refreshSession)
  } else {
    await _wipeAllUserRefreshSessions(refreshSession.user)
    await _addRefreshSession(refreshSession)
  }
}

async function _isValidSessionsCount (user) {
  const existingSessionsCount = await RefreshSessionDAO.baseGetCount({ user })
  return existingSessionsCount < MAX_REFRESH_SESSIONS_COUNT
}

async function _addRefreshSession (refreshSession) {
  await RefreshSessionDAO.baseCreate(refreshSession)
}

async function _wipeAllUserRefreshSessions (user) {
  return await RefreshSessionDAO.baseRemoveWhere({ user })
}

module.exports = { addRefreshSession }
