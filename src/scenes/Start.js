export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    create() {
        console.log("Cena Start carregada!");
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        // Logo estático no topo
        const logo = this.add.image(640, 150, 'logo'); // Ajustada posição Y para cima

        const ship = this.add.sprite(640, 360, 'ship');

        ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        ship.play('fly');

        // // Tween removido para deixar o logo estático
        // this.tweens.add({
        //     targets: logo,
        //     y: 400,
        //     duration: 1500,
        //     ease: 'Sine.inOut',
        //     yoyo: true,
        //     loop: -1
        // });

        // Criar botão de iniciar
        const startButton = this.add.image(640, 500, 'buttonGreen')
            .setInteractive()
            .setScale(1.5) // Diminuído o tamanho do botão
            .setTint(0xaaaaaa); // Adicionado tint cinza inicial

        const startText = this.add.text(640, 500, 'INICIAR', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Efeito hover no botão
        startButton.on('pointerover', () => {
            startButton.setTint(0x00ff00); // Fica verde no hover
        });

        startButton.on('pointerout', () => {
            startButton.setTint(0xaaaaaa); // Volta para cinza ao sair
        });

        // Ação ao clicar
        startButton.on('pointerdown', () => {
            this.scene.start('Game'); // Inicia a cena do jogo
        });


    }

    update() {
        this.background.tilePositionX += 2;
    }

    // preload() foi removido pois os assets de áudio foram movidos para Game.js

}
