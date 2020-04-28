import winston from 'winston'
import Elasticsearch from 'winston-elasticsearch'

import yenv from 'yenv'

const env = yenv()

export default class logManager {
  constructor () {
    const transports = []
    if (env.LOGGER?.FILE?.ENABLED) {
      transports.push(new winston.transports.File({ level: env.LOGGER.FILE.LEVEL, filename: env.LOGGER.FILE.PATH }))
    }

    if (env.LOGGER?.ELASTICSEARCH?.ENABLED) {
      const esTransportOpts = {
        level: env.LOGGER.ELASTICSEARCH.LEVEL,
        flushInterval: env.LOGGER.ELASTICSEARCH.FLUSHINTERVAL || 2000,
        buffering: env.LOGGER.ELASTICSEARCH.BUFFERING || true,
        clientOpts: {
          node: env.LOGGER.ELASTICSEARCH.URL
        }
      }
      transports.push(
        new Elasticsearch(esTransportOpts)
      )
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: transports
    })

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }))
    }
  }

  info (info) {
    this.logger.info(info)
  }

  error (appError) {
    const isOperational = appError.isOperational || false
    this.logger.error(appError)
    return isOperational
  }
}
