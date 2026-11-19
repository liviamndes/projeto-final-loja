const express = require('express');
const path = require('path');
const { criarDb } = require('./lib/db');
const { ApiError, errorHandler } = require('./lib/erro');
const { criarLogger } = require('./lib/logger');

const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

const { log, middleware } = criarLogger('clientes');
const db = criarDb(path.join(DATA_DIR, 'clientes.json'), require('../seed.json'));

const app = express();
app.use(express.json());
app.use(middleware);

app.get('/health', (req, res) => res.json({ servico: 'clientes', status: 'ok' }));

// EXEMPLO pronto (siga este padrão nas outras rotas)
app.get('/clientes/:id', (req, res) => {
  const cliente = db.ler().find((c) => c.id === Number(req.params.id));
  if (!cliente) throw new ApiError(404, 'CLIENTE_NAO_ENCONTRADO', 'Cliente não encontrado');
  res.json(cliente);
});

// TODO (Pessoa 1): GET /clientes, POST /clientes, PUT/DELETE opcionais — ver docs/CONTRATOS.md

app.use(errorHandler);
app.listen(PORT, () => log('info', `Serviço Clientes na porta ${PORT}`));
