# baciwa-be

Baciwa Backend Development

## App Pre-Installation

1. Install [Node.js](https://nodejs.org/en/)
2. Install [MongoDB](https://www.mongodb.com/try/download)

## App Installation

```bash
# with npm
npm install
```

```
Start MongoDB Service
```

Create a `.env` file in the root directory of your project.

```
NODE_ENV=development
APP_PORT = 4000
APP_HOST = 'localhost'
APP_URL = http://url.com
PAGE_SIZE = 10
APP_NAME='BACIWA-API'
COOKIE_SECRET=secretsecretsecret

# TOKENS
JWT_ISS=baciwa-api

TOKEN_ACCESS_EXP = '10m'
TOKEN_ACCESS_SECRET = '123456789012345678901234567890'

TOKEN_REFRESH_EXP = '60m'
TOKEN_REFRESH_SECRET = '123456789012345678901234567890'

TOKEN_RESET_PASSWORD_EXP = '4h'
TOKEN_RESET_PASSWORD_SECRET = '123456789012345678901234567890'

TOKEN_EMAIL_CONFIRM_EXP = '2d'
TOKEN_EMAIL_CONFIRM_SECRET = '123456789012345678901234567890'

# DB
DB_HOST = 'mongodb://localhost:27017'
DB_NAME = 'baciwahris'

# EMAIL SERVICE
MAILGUN_API_KEY = 'apiekeysample'
MAILGUN_DOMAIN = 'apiekeysample.mailgun.org'
MAILGUN_HOST = 'api.mailgun.net'
EMAIL_FROM = 'Baciwa <support@baciwa.com>'
EMAIL_TO_TEST = 'hello@gmail.com'

# Sentry
SENTRY_DSN = 'https://123456789012345678901234567890@sentry.io/12345'

# Tests
TEST_USERNAME = username_created
TEST_PASSWORD = password_created
```

```bash
# with npm
npm start # Run server.js
npm dev # Run server.js with nodemon (re-build if has changes)
```
