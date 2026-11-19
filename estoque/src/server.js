const express = require('express');
const path = require('path');
const { criarDb } = require('./lib/db');
const { ApiError, errorHandler } = require('./lib/erro');
const { criarLogger } = require('./lib/logger');

const PORT = process.env.PORT || 3002;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

const { log, middleware } = criarLogger('estoque');
const db = criarDb(path.join(DATA_DIR, 'produtos.json'), require('../seed.json'));

const app = express();
app.use(express.json());
app.use(middleware);

app.get('/health', (req, res) => res.json({ servico: 'estoque', status: 'ok' }));

// EXEMPLO pronto (siga este padrão nas outras rotas)
app.get('/produtos/:id', (req, res) => {
  const produto = db.ler().find((p) => p.id === Number(req.params.id));
  if (!produto) throw new ApiError(404, 'PRODUTO_NAO_ENCONTRADO', 'Produto não encontrado');
  res.json(produto);
});

// TODO (Pessoa 2): GET /produtos, POST /produtos,
//   POST /produtos/:id/baixa      (409 ESTOQUE_INSUFICIENTE se faltar)
//   POST /produtos/:id/reposicao  (usada por Pedidos para desfazer baixa)
// Ver docs/CONTRATOS.md

app.use(errorHandler);
app.listen(PORT, () => log('info', `Serviço Estoque na porta ${PORT}`));
