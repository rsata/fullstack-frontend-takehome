export const APP_ENV = process.env.APP_ENV || 'development'
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = process.env.PORT || '3000'
export const LOG_LEVEL = NODE_ENV === 'test' ? 'crit' : process.env.LOG_LEVEL || 'debug'
