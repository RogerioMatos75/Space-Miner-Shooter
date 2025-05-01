export class Loading extends Phaser.Scene {
    constructor() {
        super('Loading');
    }

    preload() {
        // Criar a barra de progresso
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Barra de fundo
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
        
        // Texto de carregamento
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Carregando...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        // Carregar todos os assets necessários
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');
        this.load.spritesheet('ship', 'assets/spaceship.png', { frameWidth: 176, frameHeight: 96 });
        this.load.image('crystal', 'assets/Crystals/crystal_blue.png'); // Corrigido para asset existente
        this.load.image('tiro_laser', 'assets/tiro_laser.png');
        this.load.image('buttonBlue', 'assets/UI/buttonBlue.png');
        this.load.image('buttonGreen', 'assets/UI/buttonGreen.png');
        this.load.image('buttonRed', 'assets/UI/buttonRed.png');
        this.load.image('buttonYellow', 'assets/UI/buttonYellow.png');
        
        // Carregar sons
        this.load.audio('sfx_laser1', 'assets/Sons_Efeitos/sfx_laser1.ogg');
        this.load.audio('sfx_laser2', 'assets/Sons_Efeitos/sfx_laser2.ogg');
        this.load.audio('power_up', 'assets/Sons_Efeitos/power_up.ogg');
        this.load.audio('sfx_shieldUp', 'assets/Sons_Efeitos/sfx_shieldUp.ogg');
        this.load.audio('sfx_shieldDown', 'assets/Sons_Efeitos/sfx_shieldDown.ogg');
        this.load.audio('game_over', 'assets/Sons_Efeitos/game_over.ogg');

        // Atualizar a barra de progresso
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        // Limpar quando terminar
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    create() {
        this.scene.start('Start');
    }
}