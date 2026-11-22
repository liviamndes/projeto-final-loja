const express = require('express');
const path = require('path');
const { criarDb } = require('./lib/db');
const { ApiError, errorHandler } = require('./lib/erro');
const { criarLogger } = require('./lib/logger');
const { type } = require('os');

const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');

const { log, middleware } = criarLogger('clientes');
const db = criarDb(path.join(DATA_DIR, 'clientes.json'), require('../seed.json'));

const app = express();
app.use(express.json());
app.use(middleware);

app.get('/health', (req, res) => res.json({ servico: 'clientes', status: 'ok' }));

app.get('/clientes/:id', (req, res) => {
  const cliente = db.ler().find((c) => c.id === Number(req.params.id));
  if (!cliente) throw new ApiError(404, 'CLIENTE_NAO_ENCONTRADO', 'Cliente não encontrado');
  res.json(cliente);
});

app.get('/clientes', (req, res) => {
  const clientes = db.ler();
  res.json(cliente);
});

app.post('/clientes', (req, res) => {
  const {nome, email } = req.body; 
  if(typeof nome !== 'string' || typeof email !== 'string'){
    throw new ApiError(400, 'DADOS_INVALIDOS', 'Nome e email são obrigatórios')
  }

  const nomeLimpo = nome.trim();
  const emailLimpo = email.trim().toLowerCase();
  const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}$/;
  if (!regexNome.test(nomeLimpo)) {
    throw new ApiError(
      400,
      'NOME_INVALIDO',
      'O nome deve ter pelo menos 3 letras e não pode conter números ou símbolos'
    );
  }
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(emailLimpo)) {
    throw new ApiError(400, 'EMAIL_INVALIDO', 'O formato do e-mail informado é inválido');
  }

  const clientes = db.ler(); 

  const emailJaExiste = clientes.some((c) => c.email == emailLimpo)
  if(emailJaExiste){
    throw new ApiError(409, 'EMAIL_DUPLICADO', 'Esse email já está cadastrado');
  }

  const novoId = clientes.length > 0 ? Math.max(...clientes.map((c) => c.id)) + 1 : 1; 
  const novoCliente = {
    id: novoId,
    nome: nomeLimpo,
    email: emailLimpo
  };
  clientes.push(novoCliente);
  db.salvar(clientes)
  return res.status(201).json(novoCliente);
});

app.put('/clientes/:id', (req, res) => {
  const clienteId = Number(req.params.id); 
  const {nome, email} = req.body; 

  if(typeof nome !== 'string' || typeof email !== 'string'){
    throw new ApiError(400, 'DADOS_INVALIDOS', 'Nome e email são obrigatórios')
  }

  const nomeLimpo = nome.trim();
  const emailLimpo = email.trim().toLowerCase();
  const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}$/;
  if (!regexNome.test(nomeLimpo)) {
    throw new ApiError(
      400,
      'NOME_INVALIDO',
      'O nome deve ter pelo menos 3 letras e não pode conter números ou símbolos'
    );
  }
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(emailLimpo)) {
    throw new ApiError(400, 'EMAIL_INVALIDO', 'O formato do e-mail informado é inválido');
  }

  const clientes = db.ler(); 

  const index = clientes.findIndex((c)=> c.id === clienteId);
  if (index === -1){
    throw new ApiError(404, 'CLIENTE_NAO_ENCONTRADO', 'Cliente não encontrado');
  }
  
  const emailJaExiste = clientes.some((c) => c.email == emailLimpo && c.id !==clienteId);
  if(emailJaExiste){
    throw new ApiError(409, 'EMAIL_DUPLICADO', 'Esse email já está cadastrado');
  }

  const clienteAtualizado = {id: clienteId, nome: nomeLimpo, email: emailLimpo};
  clientes[index] = clienteAtualizado; 
  db.salvar(clientes)
  return res.status(200).json(clienteAtualizado); 
}); 

// TODO (Pessoa 1): GET /clientes, POST /clientes, PUT/DELETE opcionais — ver docs/CONTRATOS.md

app.use(errorHandler);
app.listen(PORT, () => log('info', `Serviço Clientes na porta ${PORT}`));
