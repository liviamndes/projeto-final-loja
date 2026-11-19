// Log em JSON + ID de correlação (header x-correlation-id) para rastrear um pedido entre serviços.
// Ao chamar outro serviço, repasse: headers: { 'x-correlation-id': req.correlationId }
const { randomUUID } = require('crypto');

function criarLogger(servico) {
  const log = (nivel, msg, extra = {}) =>
    console.log(JSON.stringify({ t: new Date().toISOString(), servico, nivel, msg, ...extra }));

  const middleware = (req, res, next) => {
    req.correlationId = req.headers['x-correlation-id'] || randomUUID();
    res.setHeader('x-correlation-id', req.correlationId);
    res.on('finish', () =>
      log('info', `${req.method} ${req.originalUrl} -> ${res.statusCode}`, { cid: req.correlationId })
    );
    next();
  };

  return { log, middleware };
}

module.exports = { criarLogger };
