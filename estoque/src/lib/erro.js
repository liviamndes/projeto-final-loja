// produto não encontrado, estoque insuficiente e dados inválidos
class ApiError extends Error {
  constructor(status, codigo, mensagem) {
    super(mensagem);
    this.status = status;
    this.codigo = codigo;
  }
}

function errorHandler(err, req, res, next) {
  if(err instanceof ApiError) {
    res.status(err.status).json({erro: err.codigo, mensagem: err.message});
  }
  else {
    console.error(err);
    res.status(500).json({erro: 'FALHA_INESPERADA', mensagem: 'Não foi possível concluir a operação'});
  }
}
module.exports = {ApiError, errorHandler};