export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    preload() {
        // Carregar assets do jogo
        this.load.image('background', 'assets/Backgrounds/fundo_espacial.png');
        this.load.spritesheet('ship', 'assets/Naves/nave_sprite.png', { frameWidth: 128, frameHeight: 128 });
        this.load.image('tiro_laser', 'assets/Tiros/tiro_laser.png');
                // this.load.image('crystal', 'assets/Crystals/crystal_blue.png'); // Removido cristal genérico
                this.load.image('crystal_red', 'assets/Crystals/crystal_red.png');
                this.load.image('crystal_green', 'assets/Crystals/crystal_green.png');
                this.load.image('crystal_blue', 'assets/Crystals/crystal_blue.png');
                this.load.image('crystal_yellow', 'assets/Crystals/crystal_yellow.png');
        this.load.image('buttonBlue', 'assets/UI/buttonBlue.png'); // Exemplo de asset para power-up
        // Carregar os frames do escudo como imagens separadas
        this.load.image('shield_frame1', 'assets/PNG/Effects/shield1.png');
        this.load.image('shield_frame2', 'assets/PNG/Effects/shield2.png');
        this.load.image('shield_frame3', 'assets/PNG/Effects/shield3.png');
        // Carregar assets do meteoro e explosão
        this.load.image('meteor_brown_big', 'assets/PNG/Meteors/meteorBrown_big1.png'); // CONFIRME O NOME DO ARQUIVO
        this.load.image('meteor_grey_big', 'assets/PNG/Meteors/meteorGrey_big1.png'); // Adicionado meteoro cinza grande
        // Carregar assets do UFO
        this.load.image('ufo_blue', 'assets/PNG/ufoBlue.png');
        this.load.image('ufo_green', 'assets/PNG/ufoGreen.png');
        this.load.image('ufo_red', 'assets/PNG/ufoRed.png');
        this.load.image('ufo_yellow', 'assets/PNG/ufoYellow.png');
        this.load.image('enemy_ship_blue', 'assets/PNG/playerShip1_blue.png'); // Nave inimiga da onda final
        // this.load.spritesheet('explosion_effect', 'assets/PNG/Effects/explosion_spritesheet.png', { frameWidth: 64, frameHeight: 64 }); // Removido - Não estava carregando
        // this.load.spritesheet('smoke_effect', 'assets/PNG/black smoke/black_smoke_spritesheet.png', { frameWidth: 64, frameHeight: 64 }); // Removido - São imagens separadas
        // this.load.image('black_smoke00', 'assets/PNG/black smoke/black_smoke00.png'); // Removido carregamento da fumaça
        // this.load.image('black_smoke01', 'assets/PNG/black smoke/black_smoke01.png'); // Removido carregamento da fumaça
        // this.load.image('black_smoke02', 'assets/PNG/black smoke/black_smoke02.png'); // Removido carregamento da fumaça

        // Carregar sons
        this.load.audio('sfx_laser1', 'assets/Sons_Efeitos/sfx_laser1.ogg');
        this.load.audio('power_up', 'assets/Sons_Efeitos/power_up.ogg');
        this.load.audio('sfx_shieldUp', 'assets/Sons_Efeitos/sfx_shieldUp.ogg');
        this.load.audio('sfx_shieldDown', 'assets/Sons_Efeitos/sfx_shieldDown.ogg');
        this.load.audio('game_over', 'assets/Sons_Efeitos/game_over.ogg');
        // this.load.audio('explosion_sound', 'assets/Sons_Efeitos/explosion.ogg'); // Removido som de explosão
        this.load.audio('zap_sound', 'assets/Sons_Efeitos/sfx_zap.ogg'); // Adicionado som de zap
        this.load.audio('ufo_laser_sound', 'assets/Sons_Efeitos/sfx_laser2.ogg'); // Som para tiro do UFO
    }

    create() {
        // Configuração inicial
        this.score = 0;
        // this.mineralsCount = 0; // Removido
        this.crystalCounts = { // Adicionado objeto para contagem individual
            // 'crystal': 0, // Removido cristal genérico
            'crystal_red': 0,
            'crystal_green': 0,
            'crystal_blue': 0,
            'crystal_yellow': 0
        };
        this.shield = 0; // Começa com 0%
        this.lives = 3; // Adicionado contador de vidas
        this.gameTime = 180; // 3 minutos de jogo
        this.isDoubleShot = false;
        this.isSpeedBoost = false;
        this.isShieldActive = false; // Estado do escudo (ativo quando 100%)
        this.isFinalWave = false; // Flag para indicar se a onda final começou

        // Criar fundo
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        // Criar jogador
        this.player = this.physics.add.sprite(640, 600, 'ship');
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.5);

        // --- Adicionar Animação da Nave ---
        this.anims.create({
            key: 'player_fly', // Usar uma chave diferente ou a mesma 'fly' se não houver conflito
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }), // Ajuste start/end se sua spritesheet for diferente
            frameRate: 15,
            repeat: -1
        });
        this.player.play('player_fly'); // Inicia a animação
        // ---------------------------------

        // --- Criar Animação do Escudo ---
        this.anims.create({
            key: 'shield_loop',
            // Usar as chaves das imagens carregadas individualmente
            frames: [
                { key: 'shield_frame1' },
                { key: 'shield_frame2' },
                { key: 'shield_frame3' }
            ],
            frameRate: 10, // Ajuste a velocidade da animação
            repeat: -1 // Loop infinito
        });

        // // --- Criar Animação da Fumaça --- (Removido)
        // this.anims.create({
        //     key: 'smoke_puff', // <<< CONFIRME O NÚMERO DE FRAMES (end)
        //     // Usar as chaves das imagens carregadas individualmente
        //     frames: [
        //         { key: 'black_smoke00' },
        //         { key: 'black_smoke01' },
        //         { key: 'black_smoke02' }
        //     ],
        //     frameRate: 20,
        //     hideOnComplete: true // Faz o sprite desaparecer após a animação
        // });

        // Criar sprite do escudo usando o primeiro frame (inicialmente invisível)
        this.shieldSprite = this.add.sprite(this.player.x, this.player.y, 'shield_frame1'); // Usar a chave do primeiro frame
        this.shieldSprite.setScale(0.6); // Ajustar escala conforme necessário
        this.shieldSprite.setVisible(false);


        // Criar grupos de objetos
        this.lasers = this.physics.add.group();
        this.meteors = this.physics.add.group(); // Reativado grupo de meteoros
        this.crystals = this.physics.add.group();
        this.lifeIcons = this.add.group(); // Grupo para ícones de vida
        this.ufos = this.physics.add.group(); // Grupo para UFOs
        this.ufoLasers = this.physics.add.group(); // Grupo para tiros dos UFOs
        // this.powerUps = this.physics.add.group(); // Removido grupo de power-ups

        // Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // UI
        this.createUI();

        // Timers
        this.createTimers();

        // Guarda referências dos timers de spawn para poder pará-los
        this.meteorTimer = null;
        this.crystalTimer = null;
        this.ufoTimer = null;

        // Colisões
        this.setupCollisions();

        // Sons
        this.setupSounds();
    }

    createUI() {
        // Score
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff'
        });

        // Vidas (Ícones) - No lugar do antigo texto de cristais
        for (let i = 0; i < this.lives; i++) {
            // Adiciona ícones de nave pequenos
            this.lifeIcons.create(40 + i * 40, 70, 'ship').setScale(0.25).setAngle(-90); // Ajuste posição e escala
        }

        // Escudo
        this.shieldText = this.add.text(16, 96, 'Escudo: 0%', {
            fontSize: '32px',
            fill: '#fff'
        });

        // Tempo
        this.timeText = this.add.text(16, 136, 'Tempo: 3:00', {
            fontSize: '32px',
            fill: '#fff'
        });

        // Power-ups ativos
        this.powerUpText = this.add.text(16, 176, '', {
            fontSize: '24px',
            fill: '#fff'
        });

        // --- UI dos Cristais Coletados (Top-Right, Horizontal) ---
        this.crystalUITexts = {}; // Objeto para guardar referências dos textos
        const crystalTypesForUI = ['crystal_red', 'crystal_green', 'crystal_blue', 'crystal_yellow'];
        const startX = this.cameras.main.width - 350; // Posição X inicial (mais à direita)
        const startY = 20; // Posição Y inicial (topo)
        const spacingX = 80; // Espaçamento horizontal entre cristais
        const spacingY = 25; // Espaçamento vertical entre nome/imagem/contagem

        const crystalPowerUpNames = { // Nomes dos Power-ups para exibir
            'crystal_red': 'Double Shot',
            'crystal_green': 'Speed Up',
            'crystal_blue': 'Shield',
            'crystal_yellow': '+50 Pts'
        };

        crystalTypesForUI.forEach((type, index) => {
            const currentX = startX + index * spacingX;

            // 1. Adiciona o NOME do power-up (Acima)
            this.add.text(currentX, startY, crystalPowerUpNames[type] || '', {
                fontSize: '14px',
                fill: '#fff'
            }).setOrigin(0.5, 0); // Centraliza acima

            // 2. Adiciona a IMAGEM do cristal (Meio)
            this.add.image(currentX, startY + spacingY, type).setScale(0.25).setOrigin(0.5, 0); // Centraliza

            // 3. Adiciona o texto da CONTAGEM (Abaixo) e guarda a referência
            // Ajustes: Aumentar fonte, mudar cor (temporário), ajustar Y, definir depth
            this.crystalUITexts[type] = this.add.text(currentX, startY + spacingY * 2 + 40, '0', { // Posição Y = 110 (Bem mais para baixo)
                fontSize: '22px', // Aumentado
                fill: '#FFFFFF' // Branco (Voltando à cor original)
            }).setOrigin(0.5, 0.5).setDepth(1); // Centraliza H/V e garante profundidade
        });
        // -----------------------------------------------------------------
    }

    createTimers() {
        // Timer do jogo
        this.time.addEvent({
            delay: 1000,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true
        });

        // Spawn de meteoros (Reativado)
        this.meteorTimer = this.time.addEvent({
            delay: 3000, // Ajuste o delay conforme necessário
            callback: this.spawnMeteor,
            callbackScope: this,
            loop: true
        });

        // Spawn de cristais
        this.crystalTimer = this.time.addEvent({
            delay: 5000,
            callback: this.spawnCrystal,
            callbackScope: this,
            loop: true
        });

        // Spawn de UFOs
        this.ufoTimer = this.time.addEvent({
            delay: 8000, // UFOs aparecem com menos frequência
            callback: this.spawnUfo,
            callbackScope: this,
            loop: true
        });

        // // Spawn de power-ups (Removido) - Certifique-se que não há timers ativos para isso
        // this.powerUpTimer = this.time.addEvent({
        //     delay: 15000,
        //     callback: this.spawnPowerUp,
        //     callbackScope: this,
        //     loop: true
        // });
    }

    setupCollisions() {
        // Colisão entre laser e meteoros (Reativado)
        this.physics.add.collider(this.lasers, this.meteors, this.hitMeteor, null, this);

        // Colisão entre jogador e cristais (overlap para não causar dano)
        this.physics.add.overlap(this.player, this.crystals, this.collectCrystal, null, this);

        // // Colisão entre jogador e power-ups (Removido)
        // this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);

        // Colisão entre jogador e meteoros (Reativado)
        this.physics.add.collider(this.player, this.meteors, this.hitPlayer, null, this);

        // Colisão entre tiros do jogador e UFOs
        this.physics.add.collider(this.lasers, this.ufos, this.hitUfo, null, this);

        // Colisão entre tiros do UFO e jogador
        this.physics.add.collider(this.ufoLasers, this.player, this.hitPlayerByUfoLaser, null, this);
    }

    setupSounds() {
        this.laserSound = this.sound.add('sfx_laser1');
        this.powerUpSound = this.sound.add('power_up');
        this.shieldUpSound = this.sound.add('sfx_shieldUp');
        this.shieldDownSound = this.sound.add('sfx_shieldDown');
        // this.explosionSound = this.sound.add('explosion_sound'); // Removido som da explosão
        this.ufoLaserSound = this.sound.add('ufo_laser_sound'); // Adicionado som do tiro do UFO
        this.zapSound = this.sound.add('zap_sound'); // Adicionado som de zap
    }

    update() {
        // Movimento do jogador
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200 * (this.isSpeedBoost ? 1.5 : 1));
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200 * (this.isSpeedBoost ? 1.5 : 1));
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-200 * (this.isSpeedBoost ? 1.5 : 1));
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(200 * (this.isSpeedBoost ? 1.5 : 1));
        } else {
            this.player.setVelocityY(0);
        }

        // Atirar
        if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
            this.fire();
        }

        // Atualizar fundo
        this.background.tilePositionX += 2;

        // Manter o escudo visual seguindo o jogador
        this.shieldSprite.setPosition(this.player.x, this.player.y);

    }

    fire() {
        this.laserSound.play();
        
        if (this.isDoubleShot) {
            // Tiro duplo (ajustar posição Y)
            this.createLaser(this.player.y - 15); // Um pouco acima do centro da nave
            this.createLaser(this.player.y + 15); // Um pouco abaixo do centro da nave
        } else {
            // Tiro simples (no centro Y da nave)
            this.createLaser(this.player.y);
        }
    }

    createLaser(y) { // Parâmetro agora é a posição Y
        // Cria o laser um pouco à frente (direita) da nave
        const laser = this.lasers.create(this.player.x + 40, y, 'tiro_laser'); 
        laser.setVelocityX(600); // Velocidade para a direita
        laser.setVelocityY(0);   // Sem velocidade vertical
        laser.setScale(0.5);
        laser.setAngle(190); // Ajustando rotação conforme solicitado
    }

    spawnMeteor() { // Função reativada e modificada
        const x = Phaser.Math.Between(50, 1230);
        const meteorTypes = ['meteor_brown_big', 'meteor_grey_big']; // Tipos de meteoros grandes
        const randomType = Phaser.Math.RND.pick(meteorTypes); // Escolhe aleatoriamente

        const meteor = this.meteors.create(x, -100, randomType); // Usa o tipo aleatório

        meteor.setVelocityY(Phaser.Math.Between(50, 100)); // Velocidade mais lenta para meteoros grandes
        meteor.setScale(Phaser.Math.FloatBetween(0.6, 0.9)); // Tamanho reduzido (ajuste conforme necessário)
        // meteor.setAngle(Phaser.Math.Between(-15, 15)); // Ângulo pequeno (opcional)
        meteor.setAngularVelocity(Phaser.Math.Between(-20, 20)); // Rotação lenta
        meteor.setData('health', 2); // Definir vida inicial do meteoro
        meteor.setBodySize(meteor.width * 0.8, meteor.height * 0.8); // Ajustar hitbox se necessário
    }

    spawnUfo() {
        const y = Phaser.Math.Between(50, this.cameras.main.height - 50); // Posição Y aleatória
        const ufoTypes = ['ufo_blue', 'ufo_green', 'ufo_red', 'ufo_yellow']; // Array com os tipos de UFO
        const randomTypeKey = Phaser.Math.RND.pick(ufoTypes); // Escolhe um tipo aleatoriamente

        const ufo = this.ufos.create(this.cameras.main.width + 100, y, randomTypeKey); // Cria fora da tela, à direita, com tipo aleatório

        ufo.setVelocityX(Phaser.Math.Between(-100, -150)); // Velocidade para a esquerda
        ufo.setScale(0.6); // Ajuste a escala se necessário
        ufo.setData('type', randomTypeKey); // Guarda o tipo exato (chave da imagem)
        ufo.setData('health', 1); // Vida inicial (1 por enquanto)

        // Timer para o UFO atirar
        ufo.shootTimer = this.time.addEvent({
            delay: Phaser.Math.Between(1500, 3000), // Intervalo de tiro aleatório
            callback: () => this.ufoFire(ufo),
            callbackScope: this,
            loop: true
        });

        // Destruir timer quando o UFO for destruído (importante!)
        ufo.on('destroy', () => { if (ufo.shootTimer) ufo.shootTimer.remove(); });
    }
    spawnCrystal() {
        const x = Phaser.Math.Between(50, 1230);
        const crystalTypes = ['crystal_red', 'crystal_green', 'crystal_blue', 'crystal_yellow']; // Apenas os 4 tipos corretos
        const randomType = Phaser.Math.RND.pick(crystalTypes);

        const crystal = this.crystals.create(x, 0, randomType);
        crystal.setVelocityY(100);
        crystal.setScale(0.3); // Diminuída a escala do cristal spawnado
        crystal.setData('type', randomType); // Armazena o tipo do cristal
    }

    // spawnPowerUp() { // Função removida
    //     // Lógica para spawn de power-ups (pode ser ajustada)
    //     const x = Phaser.Math.Between(50, 1230);
    //     const powerUp = this.powerUps.create(x, 0, 'buttonBlue'); // Usando 'buttonBlue' como placeholder
    //     powerUp.setVelocityY(150);
    //     powerUp.setScale(0.8);
    //     // Adicionar tipo de power-up se necessário
    //     // powerUp.setData('type', 'shield');
    // }

    ufoFire(ufo) {
        if (!ufo.active) return; // Não atira se o UFO já foi destruído

        const laser = this.ufoLasers.create(ufo.x - 50, ufo.y, 'tiro_laser'); // Cria tiro um pouco à esquerda do UFO
        laser.setVelocityX(-400); // Velocidade para a esquerda
        laser.setVelocityY(0);
        laser.setScale(0.5);
        laser.setAngle(-90); // Rotaciona para apontar para a esquerda

        // Define a cor do tiro baseado no tipo do UFO
        const ufoType = ufo.getData('type');
        switch (ufoType) {
            case 'ufo_blue':
                laser.setTint(0x00aaff); // Azul claro
                break;
            case 'ufo_green':
                laser.setTint(0x00ff00); // Verde
                break;
            case 'ufo_red':
                laser.setTint(0xff0000); // Vermelho
                break;
            case 'ufo_yellow':
                laser.setTint(0xffff00); // Amarelo
                break;
        }
        // TODO: Adicionar caso para 'enemy_ship_blue' se necessário (já pega o azul?)
        this.ufoLaserSound.play();
    }
    hitMeteor(laser, meteor) { // Função reativada e modificada
        laser.destroy();

        let health = meteor.getData('health') - 1;
        meteor.setData('health', health);

        if (health <= 0) {
            // Criar e tocar animação de fumaça
            // const smoke = this.add.sprite(meteor.x, meteor.y, 'black_smoke00'); // Removido efeito de fumaça
            // smoke.play('smoke_puff'); // Removido efeito de fumaça
            // Tocar som de zap
            this.zapSound.play();

            meteor.destroy();
            this.score += 25; // Pontos por destruir meteoro grande
            this.scoreText.setText('Score: ' + this.score);
        } else {
            // Feedback visual de dano no meteoro (opcional, ex: piscar)
            meteor.setTint(0xff0000);
            this.time.delayedCall(50, () => { meteor.clearTint(); });
        }
    }
    collectCrystal(player, crystal) {
        const crystalType = crystal.getData('type');
        console.log('Coletou cristal:', crystalType);

        crystal.destroy();
        // this.crystalsCount++; // Removido
        // this.crystalsText.setText('Cristais: ' + this.crystalsCount); // Removido
        this.crystalCounts[crystalType]++; // Incrementa o contador específico
        this.crystalUITexts[crystalType].setText(this.crystalCounts[crystalType]); // Atualiza APENAS a contagem na UI

        this.powerUpSound.play(); // Tocar som de coleta

        // Ativar power-up baseado no tipo de cristal
        switch (crystalType) {
            case 'crystal_red':
                this.activateDoubleShot();
                break;
            case 'crystal_green':
                this.activateSpeedBoost();
                break;
            case 'crystal_blue':
                // Aumenta a carga do escudo
                this.shield = Math.min(100, this.shield + 20); // Aumenta 20%, max 100
                this.shieldText.setText('Escudo: ' + this.shield + '%');
                if (this.shield === 100 && !this.isShieldActive) {
                    this.activateShield(); // Ativa o escudo ao chegar a 100%
                }
                break;
            case 'crystal_yellow':
                // Ação para cristal amarelo (ex: pontos extras)
                this.score += 50; 
                this.scoreText.setText('Score: ' + this.score);
                this.powerUpText.setText('Power-up: +50 Pontos!');
                this.time.delayedCall(3000, () => { this.powerUpText.setText(''); }, [], this);
                break;
            // case 'crystal': // Cristal padrão removido
            // default: // Default não é mais necessário com tipos explícitos
            //     this.score += 5; // Apenas adiciona pontos
            //     this.scoreText.setText('Score: ' + this.score);
            //     break;
        }
    }

    // collectPowerUp(player, powerUp) { // Função removida
    //     powerUp.destroy();
    //     this.powerUpSound.play();

    //     // Lógica de power-up (exemplo: escudo temporário)
    //     // Poderia ter tipos diferentes de power-ups aqui também
    //     this.activateShield(); // Reutilizando a função de escudo por enquanto
    // }

    hitPlayer(player, obstacle) { // Renomeado segundo parâmetro para 'obstacle'
        // Destruir o meteoro imediatamente ao colidir com o jogador
        // Criar e tocar animação de fumaça
        // const smoke = this.add.sprite(meteor.x, meteor.y, 'black_smoke00'); // Removido efeito de fumaça
        // smoke.play('smoke_puff'); // Removido efeito de fumaça

        // Toca som e destrói o obstáculo (meteoro ou UFO)
        this.zapSound.play(); // Tocar som de zap
        obstacle.destroy(); // <<< CORRIGIDO: Usar 'obstacle' em vez de 'meteor'

        if (this.isShieldActive) {
            // Se o escudo está ativo, ele absorve o impacto
            this.shield = 0; // Consome a carga do escudo (ou poderia consumir só uma parte)
            this.shieldText.setText('Escudo: ' + this.shield + '%');
            this.deactivateShield(false); // Desativa o escudo visual/lógico, sem tocar som de dano
            this.shieldDownSound.play(); // Toca som específico de escudo quebrado/atingido

            // Feedback visual de escudo atingido
            this.cameras.main.shake(150, 0.015);
            this.player.setTint(0x00ccff); // Tint azul claro
            this.time.delayedCall(150, () => { this.player.clearTint(); });

        } else {
            // Se não há escudo ativo, aplica dano direto (usando a variável shield como vida)
            const damage = 35; // Dano maior por colisão direta com meteoro grande
            this.shield = Math.max(0, this.shield - damage); // Reduz a "vida", mínimo 0
            this.shieldText.setText('Escudo: ' + this.shield + '%'); // Atualiza UI (talvez renomear para Vida?)
            this.shieldDownSound.play(); // Som de dano no jogador

            // Feedback visual de dano no jogador
            this.cameras.main.shake(200, 0.02);
            this.player.setTint(0xff0000); // Tint vermelho
            this.time.delayedCall(150, () => { this.player.clearTint(); });

            if (this.shield <= 0) {
                // this.gameOver(); // Não mais game over direto
                this.loseLife();
            }
        }
    }

    hitUfo(laser, ufo) {
        laser.destroy();

        let health = ufo.getData('health') - 1;
        ufo.setData('health', health);

        if (health <= 0) {
            const ufoType = ufo.getData('type');
            let points = 0;
            switch (ufoType) {
                case 'ufo_blue': points = 50; break;
                case 'ufo_green': points = 75; break;
                case 'ufo_red': points = 100; break;
                case 'ufo_yellow': points = 125; break;
                case 'enemy_ship_blue': points = 150; break; // Pontos para nave da onda final
            }

            // Se for um inimigo da onda final, verifica se foi o último
            if (ufo.getData('isFinalWaveEnemy')) {
                this.checkWinCondition();
            }
            this.score += points;
            this.scoreText.setText('Score: ' + this.score);

            ufo.destroy(); // Destroi UFO
            // Adicionar efeito de explosão/fumaça aqui se desejar depois
        } else {
            // Feedback de dano no UFO (opcional)
            ufo.setTint(0xffffff); // Pisca branco
            this.time.delayedCall(50, () => { ufo.clearTint(); });
        }

        this.zapSound.play(); // Reutiliza o som de zap
    }

    hitPlayerByUfoLaser(player, ufoLaser) {
        ufoLaser.destroy(); // Destroi o tiro do UFO

        if (this.isShieldActive) {
            // Escudo absorve o tiro
            this.shield = 0; // Consome a carga
            this.shieldText.setText('Escudo: ' + this.shield + '%');
            this.deactivateShield(false);
            this.shieldDownSound.play(); // Som de escudo atingido

            this.cameras.main.shake(100, 0.01); // Shake menor para tiro
            this.player.setTint(0x00ccff);
            this.time.delayedCall(100, () => { this.player.clearTint(); });
        } else {
            // Dano direto ao jogador
            const damage = 15; // Dano do tiro do UFO
            this.shield = Math.max(0, this.shield - damage);
            this.shieldText.setText('Escudo: ' + this.shield + '%');
            this.shieldDownSound.play(); // Som de dano

            this.cameras.main.shake(100, 0.01);
            this.player.setTint(0xff0000);
            this.time.delayedCall(100, () => { this.player.clearTint(); });

            if (this.shield <= 0) {
                // this.gameOver(); // Não mais game over direto
                this.loseLife();
            }
        }
    }
    // --- Funções de Power-up --- 

    activateDoubleShot() {
        this.isDoubleShot = true;
        this.powerUpText.setText('Power-up: Tiro Duplo!');
        // Desativar após um tempo
        this.time.delayedCall(10000, () => {
            this.isDoubleShot = false;
            if (!this.isSpeedBoost && !this.isShieldActive) { // Limpa texto apenas se nenhum outro power-up estiver ativo
                 this.powerUpText.setText('');
            }
        }, [], this);
    }

    activateSpeedBoost() {
        this.isSpeedBoost = true;
        this.powerUpText.setText('Power-up: Velocidade!');
        // Desativar após um tempo
        this.time.delayedCall(10000, () => {
            this.isSpeedBoost = false;
             if (!this.isDoubleShot && !this.isShieldActive) { // Limpa texto apenas se nenhum outro power-up estiver ativo
                 this.powerUpText.setText('');
             }
        }, [], this);
    }

    activateShield() {
        if (!this.isShieldActive) {
            this.isShieldActive = true;
            this.shieldUpSound.play();
            this.powerUpText.setText('Power-up: Escudo!');
            // Tornar o sprite do escudo visível e iniciar a animação
            this.shieldSprite.setVisible(true);
            this.shieldSprite.play('shield_loop');

            // O escudo agora só desativa ao ser atingido
        }
    }

    deactivateShield(playHitSound = true) {
        this.isShieldActive = false;
        if (playHitSound) { // Toca som de dano apenas se não for desativado por colisão
             this.shieldDownSound.play();
        }
        if (!this.isDoubleShot && !this.isSpeedBoost) { // Limpa texto apenas se nenhum outro power-up estiver ativo
             this.powerUpText.setText('');
        }
        // Parar a animação e tornar o sprite do escudo invisível
        this.shieldSprite.stop();
        this.shieldSprite.setVisible(false);
    }

    // activateExtraLife() { // Função não utilizada no switch atual, mas mantida para referência
    //     // Lógica para adicionar vida extra (se implementado)
    //     this.powerUpText.setText('Power-up: Vida Extra!');
    //     // Remover texto após um tempo
    //     this.time.delayedCall(3000, () => {
    //         this.powerUpText.setText('');
    //     }, [], this);
    //     console.log("Vida extra coletada!"); // Placeholder
    // }

    updateGameTime() {
        this.gameTime--;
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        this.timeText.setText('Tempo: ' + minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
        
        if (this.gameTime <= 0 && !this.isFinalWave) { // Adicionada verificação !this.isFinalWave
            console.log("Tempo chegou a 0, chamando startFinalWave...");
            // this.gameOver(); // Não termina mais o jogo aqui
            this.startFinalWave(); // Inicia a onda final
        } else if (this.gameTime <= 0) {
            // console.log("Tempo em 0, mas onda final já iniciada."); // Log opcional
        }
    }

    loseLife() {
        this.lives--; // Decrementa a vida

        // Remove um ícone de vida da UI
        const lifeIconToRemove = this.lifeIcons.getLast(true); // Pega o último ícone ativo
        if (lifeIconToRemove) {
            lifeIconToRemove.destroy(); // Remove o ícone
        }

        if (this.lives <= 0) {
            // Se não há mais vidas, game over
            this.gameOver();
        } else {
            // Se ainda há vidas:
            // 1. Resetar escudo/energia para 0 (se já não estiver)
            this.shield = 0;
            this.shieldText.setText('Escudo: 0%');
            // 2. Desativar escudo visual se estiver ativo
            if (this.isShieldActive) {
                this.deactivateShield(false);
            }
            // 3. Breve invulnerabilidade (piscar e ignorar colisões)
            this.player.setAlpha(0.5);
            this.player.body.enable = false; // Desativa temporariamente a física de colisão

            this.time.delayedCall(2000, () => { // 2 segundos de invulnerabilidade
                this.player.setAlpha(1);
                this.player.body.enable = true; // Reativa a física
            }, [], this);
        }
    }

    startFinalWave() {
        if (this.isFinalWave) return; // Previne chamar múltiplas vezes
        this.isFinalWave = true;
        console.log("Executando startFinalWave...");
        console.log("ONDA FINAL INICIADA!");

        // Parar timers de spawn normais
        if (this.meteorTimer) this.meteorTimer.remove();
        if (this.crystalTimer) this.crystalTimer.remove();
        if (this.ufoTimer) this.ufoTimer.remove();

        // Opcional: Limpar inimigos/objetos existentes na tela
        this.meteors.clear(true, true);
        this.crystals.clear(true, true);
        // Poderia limpar UFOs normais também, mas vamos deixá-los por enquanto

        // Criar as paredes de inimigos
        this.createEnemyWalls();
        console.log("createEnemyWalls chamada a partir de startFinalWave.");
    }

    createEnemyWalls() {
        const wallX1 = this.cameras.main.width - 150;
        const wallX2 = this.cameras.main.width - 250;
        const startY = 100;
        const spacingY = 80;
        const numEnemiesPerWall = 6;

        for (let i = 0; i < numEnemiesPerWall; i++) {
            // Parede 1
            this.createFinalEnemy(wallX1, startY + i * spacingY);
            // Parede 2
            this.createFinalEnemy(wallX2, startY + i * spacingY);
        }
        console.log("Paredes de inimigos criadas.");
    }

    createFinalEnemy(x, y) {
        const enemy = this.ufos.create(x, y, 'enemy_ship_blue');
        enemy.setScale(0.5); // Ajuste a escala
        enemy.setAngle(90); // Apontar para a esquerda
        enemy.body.immovable = true; // Ficam parados
        enemy.setData('type', 'enemy_ship_blue');
        enemy.setData('health', 3); // Mais resistentes
        enemy.setData('isFinalWaveEnemy', true); // Marca como inimigo da onda final

        // Timer de tiro para este inimigo
        enemy.shootTimer = this.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: () => this.ufoFire(enemy),
            callbackScope: this,
            loop: true
        });
        enemy.on('destroy', () => { if (enemy.shootTimer) enemy.shootTimer.remove(); });
        // console.log(`Inimigo final criado em ${x}, ${y}`); // Log opcional
    }

    checkWinCondition() {
        // Verifica se ainda existe algum inimigo marcado como 'isFinalWaveEnemy' no grupo ufos
        const remainingEnemies = this.ufos.getChildren().some(ufo => ufo.active && ufo.getData('isFinalWaveEnemy'));
        if (!remainingEnemies) {
            this.gameWin();
        } else {
            // console.log("Ainda há inimigos da onda final."); // Log opcional
        }
    }
    gameOver() {
        console.error("GAME OVER CHAMADO INESPERADAMENTE!"); // Log de erro
        this.scene.start('Start');
    }

    gameWin() {
        console.log("VOCÊ VENCEU!");
        // Parar tudo, mostrar mensagem de vitória, ir para próxima cena, etc.
        this.physics.pause(); // Pausa a física
        this.time.removeAllEvents(); // Para todos os timers para garantir
        this.player.setTint(0x00ff00); // Deixa jogador verde
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'VOCÊ VENCEU!', { fontSize: '64px', fill: '#0f0' }).setOrigin(0.5);

        // Poderia adicionar um botão para voltar ao menu
        this.time.delayedCall(5000, () => {
             this.scene.start('Start'); // Volta para o início após 5 segundos
        }, [], this);
    }
}