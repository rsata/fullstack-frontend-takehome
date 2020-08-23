import { once } from 'lodash'
import * as app from './app'
import logger from './logger'
import { PORT, NODE_ENV } from './config'

app.start(PORT).then(() => {
  logger.info(`Listening at http://localhost:${PORT}`)
})

const gracefulShutdown = once(async exitCode => {
  logger.info('Server stopping...')

  // Forcibly shutdown after 8 seconds (Docker forcibly kills after 10 seconds)
  setTimeout(() => {
    logger.crit('Forcibly shutting down')
    // Leave time for logging / error capture
    setTimeout(() => process.exit(1), 300)
  }, 8000)

  // Stop receiving new requests, allowing inflight requests to finish
  await app.stop()
  logger.info('Server stopped')
  // Leave time for logging / error capture
  setTimeout(() => process.exit(exitCode), 300)
})

function handleUncaught(error: Error, crashType: string) {
  const errorWithMetadata = {
    ...error,
    crashType
  }

  logger.crit('😱  Server crashed', errorWithMetadata)

  // Gracefully shutdown the server on uncaught errors to allow inflight requests to finish
  gracefulShutdown(1)
}

process.on('uncaughtException', error => {
  handleUncaught(error, 'uncaughtException')
})
process.on('unhandledRejection', error => {
  handleUncaught(error, 'unhandledRejection')
})

// Termination signal sent by Docker on stop
process.on('SIGTERM', () => gracefulShutdown(0))
// Interrupt signal sent by Ctrl+C
process.on('SIGINT', () => gracefulShutdown(0))
