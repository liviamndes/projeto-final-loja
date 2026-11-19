# Mini e-commerce com serviços separados (ECOS12A)

Loja simplificada em microsserviços independentes, comunicando por **REST** e **MQTT**.

```
 Cliente ──► Pedidos (3003) ──REST──► Clientes (3001)
                │            └─REST──► Estoque + Catálogo (3002)
                └─ MQTT (loja/pedidos/criado) ──► Mosquitto (1883) ──► Notificações (3004)
```

Cada serviço roda em porta própria e cuida dos próprios dados (arquivo JSON).

## Como rodar

**Tudo junto (Docker):**
```
docker compose up --build
```
**Um serviço só, para desenvolver (precisa de Node 22):**
```
cd estoque
npm install
npm run dev
```
Para Pedidos/Notificações fora do Docker, suba só o broker: `docker compose up mosquitto`.

## Demo de falha
```
docker compose stop estoque      # derruba o Estoque
node scripts/demo.js             # Pedidos responde 503 tratado, sem travar
docker compose start estoque     # volta ao normal
```

## Documentação
- `docs/CONTRATOS.md` — rotas, erros, tópicos MQTT e payloads (**leitura obrigatória**)
- `docs/DIVISAO.md` — quem faz o quê e cronograma
