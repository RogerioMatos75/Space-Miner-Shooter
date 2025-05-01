# Space Miner Shooter

## Como Jogar
É super simples!
1. Apenas clique no botão "Run game" (ou similar) nesta página.
2. O jogo carregará diretamente no seu navegador.
3. Divirta-se!

## Requisitos para Jogar
Um navegador moderno (recomendamos Chrome, Firefox, Edge ou Safari atualizados)
Conexão com a internet (para carregar o jogo)


## Requisitos para Desenvolvimento
Framework Phaser https://phaser.io/

### Instalação do Node.js
1. Acesse [nodejs.org](https://nodejs.org)
2. Baixe a versão LTS (Long Term Support) do Node.js
3. Execute o instalador e siga as instruções
4. Verifique a instalação abrindo o terminal e digitando:
   ```bash
   node --version
   npm --version
   ```

### Instalação do Phaser 3.8
1. Em seu projeto, abra o terminal e execute:
   ```bash
   npm init -y
   npm install phaser@3.8.0
   ```

2. Ou, se preferir usar via CDN (como está configurado atualmente):
   ```html
   <script src="//cdn.jsdelivr.net/npm/phaser@3.8.0/dist/phaser.min.js"></script>
   ```

### Estrutura do Projeto
Após a instalação, certifique-se de que seu projeto tenha a seguinte estrutura básica:
   ```
   Space Miner Shooter/
   ├── index.html
   ├── src/
   │   └── main.js
   ├── package.json        # (se instalou via npm)
   └──node_modules/      # (se instalou via npm)
   ```

## Desenvolvimento Local
Para desenvolver localmente, você precisará de um servidor web local. Você pode usar:

1. Live Server (extensão do VS Code)
2. Ou via npm:
   ```bash
   npm install -g http-server
   http-server
   ```

Isso garantirá que o jogo funcione corretamente durante o desenvolvimento.