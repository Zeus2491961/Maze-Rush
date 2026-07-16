const config = {
    type: Phaser.AUTO,

    width: 400,
    height: 850,

    backgroundColor: "#000000",

    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },

    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let walls;
let coins;
let traps;
let movingTrap;
let score = 0;
let scoreText;
let exit;
let messageText;
let coinsRemaining = 4;
let timeLeft = 30;
let timerText;
let trapDirection = 1;

let leftButton;
let rightButton;
let upButton;
let downButton;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

function create(){

    // Esfera luminosa
    player = this.add.circle(200, 300, 20, 0x00ffff);

    // Física
    this.physics.add.existing(player);

    player.body.setCollideWorldBounds(true);

    // Controles teclado
    cursors = this.input.keyboard.createCursorKeys();
        
    // Texto puntaje
        scoreText = this.add.text(40, 20, 'Puntos: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        });

    // Texto tiempo
        timerText = this.add.text(220, 20, 'Tiempo: 30', {
        fontSize: '24px',
        fill: '#ffffff'
    });
    // Texto central
    messageText = this.add.text(200, 350, '', {
                fontSize: '32px',
                fill: '#ffffff',
                fontStyle: 'bold',
                align: 'center'
        });

    messageText.setOrigin(0.5);

    messageText.setDepth(100);
    // Botón izquierda
        leftButton = this.add.circle(140, 690, 28, 0xaa00ff);

        leftButton.setInteractive();
        leftButton.on('pointerdown', function () {
            leftPressed = true;
        });
    
        leftButton.on('pointerup', function () {
            leftPressed = false;
        });
    
        leftButton.on('pointerout', function () {
            leftPressed = false;
        });
    
    // Botón derecha
        rightButton = this.add.circle(260, 690, 28, 0xaa00ff);
    
        rightButton.setInteractive();
        rightButton.on('pointerdown', function () {
            rightPressed = true;
        });
    
        rightButton.on('pointerup', function () {
            rightPressed = false;
        });
    
        rightButton.on('pointerout', function () {
            rightPressed = false;
        });
            // Botón arriba
        upButton = this.add.circle(200, 640, 28, 0xaa00ff);

        upButton.setInteractive();
        upButton.on('pointerdown', function () {
            upPressed = true;
        });
    
        upButton.on('pointerup', function () {
            upPressed = false;
        });
    
        upButton.on('pointerout', function () {
            upPressed = false;
        });

    // Botón abajo
        downButton = this.add.circle(200, 740, 28, 0xaa00ff);

        downButton.setInteractive();
        downButton.on('pointerdown', function () {
            downPressed = true;
        });
    
        downButton.on('pointerup', function () {
            downPressed = false;
        });
    
        downButton.on('pointerout', function () {
            downPressed = false;
        });

    // Cronómetro
        this.time.addEvent({

            delay: 1000,
    
            callback: updateTimer,
    
            callbackScope: this,
    
            loop: true
    
        });

        // Grupo de paredes
        walls = this.physics.add.staticGroup();

        // Pared superior
        walls.create(200, 85, null)
            .setDisplaySize(320, 20)
            .refreshBody();
        // Pared inferior
        walls.create(200, 580, null)
            .setDisplaySize(320, 20)
            .refreshBody();
    
        // Pared izquierda
        walls.create(50, 340, null)
            .setDisplaySize(20, 500)
            .refreshBody();
    
        // Pared derecha
        walls.create(350, 340, null)
            .setDisplaySize(20, 500)
            .refreshBody();
            
        // Pared interna horizontal
        walls.create(200, 220, null)
            .setDisplaySize(180, 20)
            .refreshBody();
        // Pared interna vertical
        walls.create(120, 390, null)
            .setDisplaySize(20, 220)
            .refreshBody();
        // Segunda pared vertical
        walls.create(280, 390, null)
            .setDisplaySize(20, 220)
            .refreshBody();
    
        // Colisión jugador-paredes
        this.physics.add.collider(player, walls);
            // Grupo de monedas
    coins = this.physics.add.group();

    // Moneda
    const coin = this.add.circle(200, 520, 10, 0xffff00);

    this.physics.add.existing(coin);

    coins.add(coin);
        // Segunda moneda
        const coin2 = this.add.circle(80, 180, 10, 0xffff00);

        this.physics.add.existing(coin2);
    
        coins.add(coin2);
    
        // Tercera moneda
        const coin3 = this.add.circle(320, 180, 10, 0xffff00);
    
        this.physics.add.existing(coin3);
    
        coins.add(coin3);
    
        // Cuarta moneda
        const coin4 = this.add.circle(200, 360, 10, 0xffff00);
    
        this.physics.add.existing(coin4);
    
        coins.add(coin4);

    // Recoger moneda
    this.physics.add.overlap(player, coins, collectCoin, null, this);
        // Grupo de trampas
        traps = this.physics.add.group();

    // Trampa roja móvil
    movingTrap = this.add.circle(200, 430, 15, 0xff0000);

    this.physics.add.existing(movingTrap);

    movingTrap.body.setCircle(15);

    movingTrap.body.setImmovable(true);

    traps.add(movingTrap);
    
        // Colisión con trampa
        this.physics.add.overlap(player, traps, hitTrap, null, this);
            // Salida del nivel
            exit = this.add.rectangle(200, 160, 40, 40, 0x00ff00);

    this.physics.add.existing(exit);

    // Llegar a la salida
    this.physics.add.overlap(player, exit, reachExit, null, this);

}

function update(){

    player.body.setVelocity(0);

    const speed = 250;

    if(
        cursors.left.isDown ||
        leftPressed
    ){
        player.body.setVelocityX(-speed);
    }

    if(
        cursors.right.isDown ||
        rightPressed
    ){
        player.body.setVelocityX(speed);
    }

    if(
        cursors.up.isDown ||
        upPressed
    ){
        player.body.setVelocityY(-speed);
    }

    if(
        cursors.down.isDown ||
        downPressed
    ){
        player.body.setVelocityY(speed);
    }
        // Movimiento de trampa
        movingTrap.x += 2 * trapDirection;

        // Cambiar dirección
    if(movingTrap.x > 245){
            trapDirection = -1;
    }
    
    if(movingTrap.x < 155){
            trapDirection = 1;
    }

}
function collectCoin(player, coin){

    coin.destroy();

    score += 10;

    coinsRemaining--;

    scoreText.setText('Puntos: ' + score);

}

function hitTrap(player, trap){

    player.body.setVelocity(0);

    player.setFillStyle(0xff0000);

    messageText.setText('GAME OVER');

    setTimeout(function(){

        location.reload();

    }, 1500);

}
function reachExit(player, exit){

    // Si aún faltan monedas
    if(coinsRemaining > 0){

        messageText.setText('COINS\nREMAINING');

        setTimeout(function(){

            messageText.setText('');

        }, 1000);

        return;
    }

    // Completar nivel
    player.body.setVelocity(0);

    player.setFillStyle(0x00ff00);

    messageText.setText('LEVEL\nCOMPLETE');

    setTimeout(function(){

        location.reload();

    }, 1500);

}

function updateTimer(){

    timeLeft--;

    timerText.setText('Tiempo: ' + timeLeft);

    // Tiempo agotado
    if(timeLeft <= 0){

        timeLeft = 0;
    
        timerText.setText('Tiempo: 0');

        messageText.setText('GAME OVER');

        setTimeout(function(){

            location.reload();

        }, 1500);

    }

}
