# Contratos (NÃO mudar sem avisar o grupo)

Se precisar alterar algo aqui, avise no grupo ANTES — outros serviços dependem disso.

## Portas
| Serviço | Porta | Dono |
|---|---|---|
| Clientes | 3001 | Pessoa 1 |
| Estoque (+ catálogo) | 3002 | Pessoa 2 |
| Pedidos | 3003 | Pessoa 3 |
| Notificações | 3004 | Pessoa 4 |
| Mosquitto (MQTT) | 1883 | Pessoa 4 |

## Padrões gerais
- Node 22 + Express, JSON em tudo, IDs numéricos.
- Cada serviço guarda dados no próprio arquivo JSON (`data/`), **nunca acessa o arquivo de outro**.
- Todo serviço tem `GET /health` → `200 {"servico":"nome","status":"ok"}`.
- Erro sempre assim: `{"erro":"CODIGO_MAIUSCULO","mensagem":"texto legível"}` (use `ApiError` de `src/lib/erro.js`).
- Ao chamar outro serviço, repasse o header `x-correlation-id` (para rastrear nos logs).
- Chamadas REST entre serviços: **sempre com timeout** (padrão 2000 ms).

## Clientes (3001)
| Rota | Resposta |
|---|---|
| `GET /clientes` | `200 [ {id,nome,email} ]` |
| `GET /clientes/:id` | `200 {id,nome,email}` · `404 CLIENTE_NAO_ENCONTRADO` |
| `POST /clientes` body `{nome,email}` | `201 {id,nome,email}` · `400 DADOS_INVALIDOS` |

## Estoque + Catálogo (3002)
Produto: `{id, nome, descricao, preco, quantidade}`

| Rota | Resposta |
|---|---|
| `GET /produtos` | `200 [produto]` |
| `GET /produtos/:id` | `200 produto` · `404 PRODUTO_NAO_ENCONTRADO` |
| `POST /produtos` body `{nome,descricao,preco,quantidade}` | `201 produto` · `400 DADOS_INVALIDOS` |
| `POST /produtos/:id/baixa` body `{quantidade}` | `200 produto` (já atualizado) · `404` · `409 ESTOQUE_INSUFICIENTE` · `400 DADOS_INVALIDOS` |
| `POST /produtos/:id/reposicao` body `{quantidade}` | `200 produto` (usada para desfazer uma baixa) |

## Pedidos (3003)
Pedido: `{id, clienteId, itens:[{produtoId, quantidade, precoUnitario}], total, status:"CONFIRMADO", criadoEm}`

| Rota | Resposta |
|---|---|
| `POST /pedidos` body `{clienteId, itens:[{produtoId, quantidade}]}` | `201 pedido` |
| `GET /pedidos` · `GET /pedidos/:id` | `200` · `404 PEDIDO_NAO_ENCONTRADO` |

Erros de `POST /pedidos`:
- `400 DADOS_INVALIDOS` — corpo inválido
- `404 CLIENTE_NAO_ENCONTRADO` / `404 PRODUTO_NAO_ENCONTRADO`
- `409 ESTOQUE_INSUFICIENTE` — nada é baixado (repor o que já tinha sido baixado)
- `503 SERVICO_INDISPONIVEL` — Clientes ou Estoque fora do ar/timeout (**erro tratado, sem travar**)

Fluxo: validar cliente → baixar estoque de cada item (desfaz se falhar) → gravar → publicar no MQTT.
Se o MQTT falhar depois de gravar, o pedido continua válido (apenas logar o erro).

## MQTT
- Broker: `mqtt://mosquitto:1883` (no Docker) · `mqtt://localhost:1883` (fora do Docker)
- Tópico: `loja/pedidos/criado` · QoS 1
- Payload (JSON):
```json
{
  "pedidoId": 1,
  "cliente": { "id": 1, "nome": "Maria Silva", "email": "maria@example.com" },
  "itens": [ { "produtoId": 1, "nome": "Camiseta Básica", "quantidade": 2, "precoUnitario": 49.9 } ],
  "total": 99.8,
  "criadoEm": "2026-11-20T14:00:00.000Z"
}
```

## Notificações (3004)
Assina `loja/pedidos/#` e registra: `{id, pedidoId, para, assunto, mensagem, criadoEm}` ("e-mail" simulado).

| Rota | Resposta |
|---|---|
| `GET /notificacoes` | `200 [notificacao]` |
