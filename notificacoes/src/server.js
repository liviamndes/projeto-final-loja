const express = require('express');
const path = require('path');
const mqtt = require('mqtt');
const { criarDb } = require('./lib/db');
const { errorHandler } = require('./lib/erro');
const { criarLogger } = require('./lib/logger');

const PORT = process.env.PORT || 3004;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const MQTT_URL = process.env.MQTT_URL || 'mqtt://localhost:1883';

const { log, middleware } = criarLogger('notificacoes');
const db = criarDb(path.join(DATA_DIR, 'notificacoes.json'), require('../seed.json'));

const app = express();
app.use(express.json());
app.use(middleware);

app.get('/health', (req, res) => res.json({ servico: 'notificacoes', status: 'ok' }));

// TODO (Pessoa 4): GET /notificacoes (lista as notificações registradas)

// --- MQTT: assinante (já conecta e loga; falta registrar a notificação) ---
// clean:false + clientId fixo + qos 1 => mensagens publicadas enquanto este serviço
// estava fora do ar são entregues quando ele volta.
const client = mqtt.connect(MQTT_URL, { clientId: 'notificacoes-svc', clean: false });
client.on('connect', () => {
  log('info', 'MQTT conectado', { MQTT_URL });
  client.subscribe('loja/pedidos/#', { qos: 1 });
});
client.on('error', (e) => log('erro', 'MQTT: ' + e.message));
client.on('message', (topic, payload) => {
  log('info', 'Mensagem recebida', { topic, payload: payload.toString() });
  // TODO (Pessoa 4): montar a notificação ("e-mail simulado") e salvar com db.salvar(...)
});

app.use(errorHandler);
app.listen(PORT, () => log('info', `Serviço Notificações na porta ${PORT}`));
