const fs = require('fs')

class Db {
  constructor(arquivo, seed) {
    this.arquivo = arquivo
    if(!fs.existsSync(arquivo)) {
      fs.writeFileSync(arquivo, JSON.stringify(seed, null, 2));
    }
  }

  ler() {
    const texto = fs.readFileSync(this.arquivo, 'utf8');
    return JSON.parse(texto);
  }

  salvar(dados) {
    fs.writeFileSync(this.arquivo, JSON.stringify(dados, null, 2));
  }
}
module.exports = { Db };