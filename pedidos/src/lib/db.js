// "Banco" em arquivo JSON. Cada serviço tem o SEU arquivo (dados próprios).
// Uso: const db = criarDb('./data/x.json', seed); const lista = db.ler(); db.salvar(lista);
const fs = require('fs');
const path = require('path');

function criarDb(arquivo, seed = []) {
  fs.mkdirSync(path.dirname(arquivo), { recursive: true });
  if (!fs.existsSync(arquivo)) fs.writeFileSync(arquivo, JSON.stringify(seed, null, 2));
  return {
    ler: () => JSON.parse(fs.readFileSync(arquivo, 'utf8')),
    salvar: (dados) => {
      const tmp = arquivo + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(dados, null, 2));
      fs.renameSync(tmp, arquivo); // escrita atômica
    },
  };
}

module.exports = { criarDb };
