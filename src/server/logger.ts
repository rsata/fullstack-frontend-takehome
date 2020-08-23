import * as winston from 'winston'
import * as ecsLogs from 'ecs-logs-js'
import * as consoleFormatter from 'winston-console-formatter'
import { NODE_ENV, LOG_LEVEL } from './config'

const logger = new winston.Logger({
  levels: ecsLogs.Levels
})

// Output human readable logs in development
if (NODE_ENV === 'development') {
  const { formatter, timestamp } = consoleFormatter()
  logger.add(winston.transports.Console, {
    level: LOG_LEVEL,
    formatter,
    timestamp
  })
} else {
  logger.add(ecsLogs.Transport, {
    level: LOG_LEVEL
  })
}

export default logger
