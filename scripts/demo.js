// Roteiro da demo. Uso: node scripts/demo.js   (requer Node 18+)
// TODO (Pessoa 4): ajustar conforme o grupo decidir o roteiro final.
const PEDIDOS = process.env.PEDIDOS_URL || 'http://localhost:3003';
const NOTIF = process.env.NOTIF_URL || 'http://localhost:3004';

async function req(titulo, url, opts) {
  console.log(`\n=== ${titulo}`);
  try {
    const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(5000) });
    console.log(r.status, JSON.stringify(await r.json().catch(() => null), null, 2));
  } catch (e) {
    console.log('FALHA DE REDE:', e.message);
  }
}
const post = (body) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

(async () => {
  await req('1) Pedido válido', `${PEDIDOS}/pedidos`, post({ clienteId: 1, itens: [{ produtoId: 1, quantidade: 2 }] }));
  await req('2) Produto sem estoque (esperado 409)', `${PEDIDOS}/pedidos`, post({ clienteId: 1, itens: [{ produtoId: 4, quantidade: 1 }] }));
  await req('3) Cliente inexistente (esperado 404)', `${PEDIDOS}/pedidos`, post({ clienteId: 999, itens: [{ produtoId: 1, quantidade: 1 }] }));
  await req('4) Notificações registradas', `${NOTIF}/notificacoes`);
  console.log('\nAgora derrube o Estoque (docker compose stop estoque) e rode de novo: o passo 1 deve dar 503 tratado.');
})();
