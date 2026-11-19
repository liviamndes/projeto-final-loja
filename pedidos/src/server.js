const express = require('express');
const path = require('path');
const { criarDb } = require('./lib/db');
const { ApiError, errorHandler } = require('./lib/erro');
const { criarLogger } = require('./lib/logger');

const PORT = process.env.PORT || 3003;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const CLIENTES_URL = process.env.CLIENTES_URL || 'http://localhost:3001';
const ESTOQUE_URL = process.env.ESTOQUE_URL || 'http://localhost:3002';
const MQTT_URL = process.env.MQTT_URL || 'mqtt://localhost:1883';
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 2000);

const { log, middleware } = criarLogger('pedidos');
const db = criarDb(path.join(DATA_DIR, 'pedidos.json'), require('../seed.json'));

const app = express();
app.use(express.json());
app.use(middleware);

app.get('/health', (req, res) => res.json({ servico: 'pedidos', status: 'ok' }));

// TODO (Pessoa 3): POST /pedidos, GET /pedidos, GET /pedidos/:id
// Fluxo de POST /pedidos (detalhes em docs/CONTRATOS.md):
//   1. validar corpo (400 DADOS_INVALIDOS)
//   2. GET  {CLIENTES_URL}/clientes/:id            (404 -> CLIENTE_NAO_ENCONTRADO)
//   3. para cada item: POST {ESTOQUE_URL}/produtos/:id/baixa
//      - use chamar() de ./lib/http.js (a implementar, Pessoa 3): já trata timeout e 503
//      - se Estoque/Clientes estiver fora -> 503 SERVICO_INDISPONIVEL (NÃO travar!)
//      - se um item falhar, repor (reposicao) os itens já baixados
//   4. gravar pedido no db
//   5. publicar no MQTT: tópico loja/pedidos/criado (qos 1)
app.post('/pedidos', (req, res) => {
  throw new ApiError(501, 'NAO_IMPLEMENTADO', 'POST /pedidos ainda não implementado');
});

app.use(errorHandler);
app.listen(PORT, () => log('info', `Serviço Pedidos na porta ${PORT}`, { CLIENTES_URL, ESTOQUE_URL, MQTT_URL }));
