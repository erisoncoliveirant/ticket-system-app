const fs = require('fs')
const jsonServer = require('json-server')
const config = require('./config')
const server = jsonServer.create()
const router = jsonServer.router('apiMock/db.json')
const userdb = JSON.parse(fs.readFileSync('apiMock/users.json', 'UTF-8'))
const middlewares = jsonServer.defaults()

const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(middlewares)

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload
function createToken (payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

// Verify the token
function verifyToken (token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Check if the user exists in database
function isAuthenticated ({ email, password }) {
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

server.use(jsonServer.rewriter({
  '/api/*': '/$1'
}))

// Register New User
server.post('/auth/register', (req, res) => {
  console.log('register endpoint called; request body:')
  console.log(req.body)
  const { email, password } = req.body

  if (isAuthenticated({ email, password }) === true) {
    const status = 401
    const message = 'Email and Password already exist'
    res.status(status).json({ status, message })
    return
  }

  fs.readFile('./users.json', (err, data) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    };

    // Get current users data
    data = JSON.parse(data.toString())

    // Get the id of last user
    const lastItemId = data.users[data.users.length - 1].id

    // Add new user
    data.users.push({ id: lastItemId + 1, email: email, password: password }) // add some data
    fs.writeFile('./users.json', JSON.stringify(data), (err, result) => { // WRITE
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({ status, message })
      }
    })
  })

  // Create token for new user
  const accessToken = createToken({ email, password })
  console.log('Access Token:' + accessToken)
  res.status(200).json({ accessToken })
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log('login endpoint called; request body:')
  console.log(req.body)
  const { email, password } = req.body
  if (isAuthenticated({ email, password }) === false) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({ status, message })
    return
  }
  const accessToken = createToken({ email, password })
  console.log('Access Token:' + accessToken)
  res.status(200).json({ accessToken })
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({ status, message })
    return
  }
  try {
    const verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1])

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res.status(status).json({ status, message })
      return
    }
    next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({ status, message })
  }
})

// Send BAD Request when title contains 'ERROR'
// TODO: Transform this into a 'rules.json' to be more flexible
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  const changeDb = req.method === 'POST' || req.method === 'PUT'
  if (changeDb && req.body.title) {
    if (req.body.title.toLowerCase().includes('erro')) {
      res.sendStatus(400)
    } else {
      next()
    }
  } else {
    next()
  }
})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

server.use((req, res, next) => {
  if (config.SLEEP && config.SLEEP > 0) {
    sleep(config.SLEEP).then(() => {
      next()
    })
  } else {
    next()
  }
})

server.use(router)
server.listen(config.PORT, () => {
  if (config.SLEEP) {
    console.log(`SLEEP MODE: ${config.SLEEP}ms delay`)
  }
  console.log(`🚀 JSON Server is running on http://localhost:${config.PORT}`)
})
