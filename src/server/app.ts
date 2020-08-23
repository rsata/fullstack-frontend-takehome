import * as express from 'express'
import * as helmet from 'helmet'
import * as nanoid from 'nanoid'
import logger from './logger'
import { NODE_ENV } from './config'
import * as path from 'path'
import * as http from 'http'
import * as next from 'next'
import * as cookieParser from 'cookie-parser'

const nextApp = next({
  dev: NODE_ENV === 'development',
  dir: './src'
})
const nextRequestHandler = nextApp.getRequestHandler()

const app = express()
const server = http.createServer(app)

// Additional properties we include on the express Request object
interface IRequestContext {
  requestId?: string
}

// Sets a bunch of security headers
// https://github.com/helmetjs/helmet#how-it-works
app.use(helmet())

// Causes `req.ip` to be set to the `X-Forwarded-For` header value, which is set by the ELB
app.set('trust proxy', true)

app.use(cookieParser())

// Used by load balancers
app.get('/healthcheck', (_, res) => res.send('ok'))

// Request logger middleware
app.use((req: express.Request & IRequestContext, res: express.Response, nextHandler: express.NextFunction) => {
  const startTime = Date.now()
  // Generate an ID for the request. Used for tying together request logs and errors
  req.requestId = nanoid()

  // Ignore HMR and favicon requests
  if (!req.path.startsWith('/_next') || req.path === '/favicon.ico') {
    logger.info('🌎  Request', {
      requestId: req.requestId,
      method: req.method,
      path: req.path
    })

    res.on('finish', () => {
      logger.info('✅  Response', {
        requestId: req.requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: Date.now() - startTime
      })
    })
  }

  nextHandler()
})

app.get('*', (req, res) => {
  // Next.js
  nextRequestHandler(req, res)
})

// Catch all error handler
app.use((error: any, req: express.Request & IRequestContext, res: express.Response, _: express.NextFunction) => {
  let statusCode = 500
  let message = 'Internal server error'

  // Decorate the error with useful info to aid debugging
  error.requestId = req.requestId
  error.referer = req.headers.referer
  error.userAgent = req.headers['user-agent']
  error.method = req.method
  error.path = req.path

  // Return request validation errors (JSON parsing errors) and don't log them
  if (error.expose && error.statusCode === 400) {
    statusCode = 400
    message = 'Bad request'
  } else {
    logger.error('🤦  Server Error', error)
  }

  // Only return the error message in development
  if (NODE_ENV !== 'production') {
    message = error.message || error
  }

  res.status(statusCode).json({ error: message })
})

export const start = async (port: string) => {
  await nextApp.prepare()

  return new Promise((resolve, reject) => {
    server.listen(port, (error: any) => {
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}

export const stop = async () => {
  if (!server.listening) {
    return Promise.resolve()
  }

  await nextApp.close()

  return new Promise((resolve, reject) => {
    server.close((error: any) => {
      if (error) {
        return reject(error)
      }
      resolve()
    })
  })
}

export default app
