// Padrão de erro do projeto: { erro: "CODIGO_EM_MAIUSCULO", mensagem: "texto legível" }
class ApiError extends Error {
  constructor(status, codigo, mensagem) {
    super(mensagem);
    this.status = status;
    this.codigo = codigo;
  }
}

// Middleware final do Express: converte qualquer erro em JSON padronizado.
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ erro: err.codigo, mensagem: err.message });
  }
  console.error(err);
  res.status(500).json({ erro: 'ERRO_INTERNO', mensagem: 'Erro interno do serviço' });
}

module.exports = { ApiError, errorHandler };
