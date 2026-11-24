function log(msg) {
  console.log(msg);
}

function middleware(req, res, next) {
  log(req.method + ' ' + req.url);
  next()
}

module.exports = {log, middleware};