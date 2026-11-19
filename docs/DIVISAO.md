# Divisão de tarefas (4 pessoas, 2 semanas)

Cada pessoa é dona de UM serviço e trabalha só na própria pasta → quase não há conflito no Git.
O esqueleto de cada serviço já tem `/health`, uma rota de exemplo, banco JSON e logger. Siga o padrão.

| | Dono | Pasta | Porta |
|---|---|---|---|
| Pessoa 1 | ______ | `clientes/` + `scripts/` | 3001 |
| Pessoa 2 | ______ | `estoque/` | 3002 |
| Pessoa 3 | ______ | `pedidos/` (inclui `pedidos/src/lib/http.js`) | 3003 |
| Pessoa 4 | ______ | `notificacoes/` + `mosquitto/` + `docs/` | 3004 / 1883 |

## Tarefas por pessoa

### Pessoa 1 — Clientes + testes e roteiro da demo
- [ ] `GET /clientes`, `POST /clientes` (validação: nome e e-mail obrigatórios, e-mail com formato válido)
- [ ] `PUT /clientes/:id` e `DELETE /clientes/:id`
- [ ] `scripts/demo.js`: roteiro da apresentação (fluxo feliz, sem estoque, cliente inexistente, Estoque fora do ar)
- [ ] Testar todos os cenários de falha com o grupo na semana 2 (e anotar os resultados para o relatório)
- [ ] Relatório: escrever a seção do serviço Clientes

### Pessoa 2 — Estoque + Catálogo
- [ ] `GET /produtos`, `POST /produtos`
- [ ] `POST /produtos/:id/baixa` com 409 `ESTOQUE_INSUFICIENTE` (cuidado: ler → checar → salvar sem intercalar requisições)
- [ ] `POST /produtos/:id/reposicao`
- [ ] Opcional: busca/filtro de produtos (`?nome=`)
- [ ] Relatório: escrever a seção do serviço Estoque

### Pessoa 3 — Pedidos (serviço central)
- [ ] `POST /pedidos` seguindo o fluxo de `docs/CONTRATOS.md`
- [ ] **`pedidos/src/lib/http.js` → `chamar()`**: chamada REST com timeout que devolve `503 SERVICO_INDISPONIVEL` quando o serviço está fora (é a base da demo de falha). **Fazer primeiro**, ver o comentário no arquivo.
- [ ] Usar `chamar()` para falar com Clientes e Estoque
- [ ] Desfazer baixas se um item falhar (compensação)
- [ ] Publicar `loja/pedidos/criado` no MQTT (qos 1)
- [ ] `GET /pedidos`, `GET /pedidos/:id`
- [ ] Relatório: escrever a seção do serviço Pedidos (fluxo, desfazer baixas, tratamento de falhas)

### Pessoa 4 — Notificações + MQTT + documentação
- [ ] Notificações: salvar a notificação ao receber a mensagem ("e-mail" simulado) e `GET /notificacoes`
- [ ] Testar entrega com Notificações fora do ar (`clean:false` + qos 1 já configurados)
- [ ] Revisar `docker-compose.yml` e `mosquitto.conf`
- [ ] `README.md` final e diagrama de arquitetura
- [ ] Relatório/slides: montar o documento final juntando as seções de cada pessoa; escrever a seção de Notificações/MQTT e a introdução

## Cronograma (ajustar ao prazo real)
| Quando | Meta |
|---|---|
| **Hoje/amanhã** | Reunião de 30 min: ler `CONTRATOS.md`, preencher nomes, cada um roda o próprio serviço |
| **Até o fim da semana 1** | Cada serviço pronto **isolado** (testado com curl/Postman) |
| **Início da semana 2** | Integração: `docker compose up --build` com tudo; Pessoa 3 liga Clientes + Estoque + MQTT |
| **Meio da semana 2** | Cenários de falha, ajustes, README, relatório |
| **2 dias antes** | Ensaio completo da demo; congelar o código |

## Fluxo de trabalho
1. Cada um trabalha numa branch (`git checkout -b clientes`) e só mexe na própria pasta.
2. Mudou um contrato? Edite `docs/CONTRATOS.md` e avise o grupo.
3. Merge na `main` em PR pequeno, com o serviço ainda subindo.
