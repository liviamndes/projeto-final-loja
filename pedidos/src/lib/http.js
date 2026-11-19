// TODO (Pessoa 3): implementar. Usado pelo próprio serviço Pedidos.
//
// chamar(url, { method, body, correlationId, timeoutMs })
//   - faz a chamada REST a outro serviço com TIMEOUT (use AbortSignal.timeout)
//   - sucesso (2xx)  -> devolve o JSON da resposta
//   - o outro serviço respondeu erro (ex.: 404, 409) -> lança ApiError com o MESMO status e codigo
//       que ele devolveu ({erro, mensagem})
//   - serviço fora do ar / timeout / conexão recusada -> lança
//       ApiError(503, 'SERVICO_INDISPONIVEL', 'Serviço X indisponível no momento')
//   - repassa o header x-correlation-id
const { ApiError } = require('./erro');

async function chamar(url, { method = 'GET', body, correlationId, timeoutMs = 2000 } = {}) {
  throw new ApiError(501, 'NAO_IMPLEMENTADO', 'http.chamar ainda não implementado');
}

module.exports = { chamar };
