module.exports = {
  info: (...args) => console.info(new Date(), '|', ...args),
  debug: (...args) => console.log(new Date(), '|', ...args),
  error: (...args) => console.error(new Date(), '|', ...args),
  warn: (...args) => console.warn(new Date(), '|', ...args),
}
