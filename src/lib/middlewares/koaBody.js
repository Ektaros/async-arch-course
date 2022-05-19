const koaBody = require('koa-body');

module.exports = koaBody({
  json: true,
  urlencoded: true,
  multipart: false,
  text: false,
  jsonLimit: '128kb',
});
