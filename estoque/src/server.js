const express = require('express');
const path = require('path');
const { Db } = require('./lib/db');
const { ApiError, errorHandler } = require('./lib/erro');
const { log, middleware } = require('./lib/logger');

const PORT = process.env.PORT || 3002;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

const db = new Db(path.join(DATA_DIR, 'produtos.json'), require('../seed.json'));

const app = express();
app.use(express.json());
app.use(middleware);

app.get('/health', (req, res) => res.json({ servico: 'estoque', status: 'ok' }));

app.get('/produtos/:id', (req, res) => {
  const produto = db.ler().find((p) => p.id === Number(req.params.id));
  if (!produto) throw new ApiError(404, 'PRODUTO_NAO_ENCONTRADO', 'Produto não encontrado');
  res.json(produto);
});

app.get('/produtos', (req, res) => {
  const produtos = db.ler();
  res.json(produtos);
});

app.post('/produtos', (req, res) => {
  if(req.body.nome != null && req.body.preco > 0 && req.body.quantidade >= 0) {
    const produtos = db.ler();
    const id = produtos.length + 1;
    const novoProduto = {id: id, nome: req.body.nome, descricao: req.body.descricao, 
                        preco: req.body.preco, quantidade: req.body.quantidade};
    produtos.push(novoProduto);
    db.salvar(produtos);
    res.status(201).json(novoProduto);
  }
  else {
    throw new ApiError(400, 'DADOS_INVALIDOS', 'Dados inválidos');
}
})

app.post('/produtos/:id/baixa', (req, res) => {
  const estoque = db.ler();
  const produto = estoque.find((p) => p.id === Number(req.params.id));

  if(!produto) throw new ApiError(404, 'PRODUTO_NAO_ENCONTRADO', 'Produto não encontrado');
  if(!(req.body.quantidade > 0)) throw new ApiError(400, 'DADOS_INVALIDOS', 'Dados inválidos');
  if(req.body.quantidade > produto.quantidade) throw new ApiError(409, 'ESTOQUE_INSUFICIENTE', 'Estoque insuficiente');

  produto.quantidade = produto.quantidade - req.body.quantidade;
  db.salvar(estoque);
  res.json(produto);
})

//   POST /produtos/:id/reposicao  (usada por Pedidos para desfazer baixa)
// Ver docs/CONTRATOS.md

app.use(errorHandler);
app.listen(PORT, () => log(`Serviço Estoque na porta ${PORT}`));