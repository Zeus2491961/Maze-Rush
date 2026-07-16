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
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let playerSprite;
let playerEye;
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
let gameStarted = false;
let startText;
let titleText;
let startBackground;
let logo;
let startStars = [];
let restartText;
let nextLevelText;
let coinSound;
let winSound;
let music;
let explodeSound;
let touchActive = false;
let touchX = 0;
let touchY = 0;
let mineSprite;
let introMusic;

function preload(){

    this.load.image('Fparedes1', 'Fparedes1.png');
    this.load.audio('coin', 'coin.mp3');
    this.load.audio('win', 'win.mp3');
    this.load.audio('music', 'music.mp3');
    this.load.audio('explode', 'explode.mp3');
    this.load.image('logo', 'logo.png');
    this.load.image('fondoInicio', 'fondo_inicio.png');
    this.load.image('playerFront', 'playerFront.png');
    this.load.image('playerLeft', 'playerLeft.png');
    this.load.image('playerRight', 'playerRight.png');
    this.load.image('playerUp', 'playerUp.png');
    this.load.image('playerDown', 'playerDown.png');
    this.load.image('mine', 'mine.png');
    this.load.audio('introMusic', 'inicio.mp3');
    this.load.image('startButton', 'startButton.png');

}
function create(){
// Sonido moneda
    coinSound = this.sound.add('coin');

// Sonido victoria
winSound = this.sound.add('win', {
    volume: 0.35
});

/// Música fondo
music = this.sound.add('music', {
    volume: 0.10,
    loop: true
});
// Sonido explosión
explodeSound = this.sound.add('explode');
introMusic = this.sound.add('introMusic', {
    volume: 0.10,
    loop: true
});

introMusic.play();
    const mazeImage = this.add.image(
        // mover todo el laberinto
        202,// Izquierda o derecha
        388,//sube o baja la imagen
        'Fparedes1'
    );
    //Harlo más ancho o más angosto
    // 0.50 mas ancho o más angosto
    //0.475 más alto o más bajo
    mazeImage.setScale(0.50, 0.50);
    mazeImage.setDepth(50);
    mazeImage.setVisible(false);    

// Fondo de estrellas
for(let i = 0; i < 140; i++){

    const star = this.add.circle(

        Phaser.Math.Between(0, 400),
        Phaser.Math.Between(0, 850),
        Phaser.Math.Between(1, 2),
        0xccffff

    );

    star.setAlpha(Math.random());

// Titilar estrellas
    this.tweens.add({

        targets: star,

        alpha: 0.15,

        duration: Phaser.Math.Between(400, 1200),

        yoyo: true,

        repeat: -1

    });
}

    // Esfera luminosa
// Glow exterior
const glowOuter = this.add.circle(200, 300, 20, 0x004444)
    .setAlpha(0.25);

// Glow medio
const glowMiddle = this.add.circle(200, 300, 17, 0x00aaff)
    .setAlpha(0.35);

// Jugador principal
player = this.add.circle(200, 300, 20, 0x00ffff);
// Punto indicador
playerEye = this.add.circle(
    200,
    300,
    4,
    0xff0000
);

player.setStrokeStyle(3, 0xffffff);

// Ocultar el círculo del jugador
player.setAlpha(0);
playerEye.setVisible(false);

glowOuter.setVisible(false);

glowMiddle.setVisible(false);


// Física
this.physics.add.existing(player);

player.body.setCollideWorldBounds(true);
// Unir glows al jugador
player.glowOuter = glowOuter;
player.glowMiddle = glowMiddle;

    player.setStrokeStyle(3, 0xffffff);

// Física
    this.physics.add.existing(player);

    player.body.setCollideWorldBounds(true);

// Controles teclado
    cursors = this.input.keyboard.createCursorKeys();
    this.input.addPointer(1);
        
    this.input.on('pointerdown', function(pointer){

        touchActive = true;
        touchX = pointer.x;
        touchY = pointer.y;
    
    });
    this.input.on('pointerupoutside', function(){

        touchActive = false;
    
    });
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
    
// Fondo pantalla inicio
startBackground = this.add.image(
    200,
    355,
    'fondoInicio'
);

startBackground.setDisplaySize(
    400,
    850
);

startBackground.setDepth(1);
// Estrellas pantalla inicio
    for(let i = 0; i < 80; i++){

    const startStar = this.add.circle(

        Phaser.Math.Between(0, 400),
        Phaser.Math.Between(0, 850),
        Phaser.Math.Between(1, 2),
        0xccffff

    );

    startStar.setAlpha(Math.random());

    startStar.setDepth(1);

    startStars.push(startStar);
// Titilar estrellas inicio
    this.tweens.add({

    targets: startStar,

    alpha: 0.15,

    duration: Phaser.Math.Between(400, 1200),

    yoyo: true,

    repeat: -1

});

}
/* // Logo
logo = this.add.image(
    200,
    100,
    'logo'
);

logo.setScale(0.55);

logo.setDepth(2);
*/

/* // Título del juego
    titleText = this.add.text(
    200,
    280,
    'CYBER\nMAZE',
    {
        fontSize: '48px',
        fill: '#ff3333',
        stroke: '#000000',
        strokeThickness: 6,
        fontStyle: 'bold',
        align: 'center'
    }
);

titleText.setOrigin(0.5);
titleText.setDepth(2);
*/

// Botón START
/* startText = this.add.text(
    200,
    640,
    'START',
    {
        fontSize: '36px',
        fill: '#ffffff',
        backgroundColor: '#5500aa',
        padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
        }
    }
);
    startText.setOrigin(0.5);
    startText.setDepth(2);
    startText.setInteractive();
    */
    const startButton = this.add.image(
        200,
        590,
        'startButton'
    );
    
    startButton.setDepth(3);
    startButton.setScale(0.50);
    startButton.setInteractive();

// Acción botón START
startButton.on('pointerdown', function(){

    mazeImage.setVisible(true);
    introMusic.stop();  
    music.play();

    gameStarted = true;
    playerSprite = this.scene.add.image(
        player.x,
        player.y,
        'playerFront'
    );
    
    playerSprite.setDepth(60);
    playerSprite.setScale(0.08);
    mineSprite.setVisible(true);

// Fade estrellas inicio
startStars.forEach(function(star){

    star.scene.tweens.add({

        targets: star,

        alpha: 0,

        duration: 800,

        onComplete: function(){

            star.destroy();

        }

    });

});

// Fade fondo inicio
startBackground.scene.tweens.add({

    targets: startBackground,

    alpha: 0,

    duration: 800,

    onComplete: function(){

        startBackground.destroy();

    }

});

/* // Fade logo
logo.scene.tweens.add({

    targets: logo,

    alpha: 0,

    duration: 800,

    onComplete: function(){

        logo.destroy();

    }

});
*/
/* // Fade título
titleText.scene.tweens.add({

    targets: titleText,

    alpha: 0,

    duration: 800,

    onComplete: function(){

        titleText.destroy();

    }

});
*/

// Fade botón START
startButton.scene.tweens.add({

    targets: startButton,

    alpha: 0,

    duration: 800,

    onComplete: function(){

        startButton.destroy();

    }

});
});
// Botón izquierda
        leftButton = this.add.circle(120, 660, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(110, 645, '◀', {
            fontSize: '28px',
            fill: '#ffffff'
        });

        leftButton.setInteractive();
        leftButton.setAlpha(0.6);
        leftButton.on('pointerdown', function () {

            leftPressed = true;
        
            leftButton.setFillStyle(0xffffff);
        
        });
    
        leftButton.on('pointerup', function () {

            leftPressed = false;
        
            leftButton.setFillStyle(0xaa00ff);
        
        });
    
        leftButton.on('pointerout', function () {
            leftPressed = false;
        });
    
    // Botón derecha
        rightButton = this.add.circle(280, 660, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(272, 645, '▶', {
            fontSize: '28px',
            fill: '#ffffff'
        });
    
        rightButton.setInteractive();
        rightButton.setAlpha(0.6);
        rightButton.on('pointerdown', function () {

            rightPressed = true;
        
            rightButton.setFillStyle(0xffffff);
        
        });
    
        rightButton.on('pointerup', function () {

            rightPressed = false;
        
            rightButton.setFillStyle(0xaa00ff);
        
        });
    
        rightButton.on('pointerout', function () {

            rightPressed = false;
        
            rightButton.setFillStyle(0xaa00ff);
        
        });
    // Botón arriba
        upButton = this.add.circle(200, 625, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(192, 610, '▲', {
            fontSize: '28px',
            fill: '#ffffff'
        });

        upButton.setInteractive();
        upButton.setAlpha(0.6);
        upButton.on('pointerdown', function () {

            upPressed = true;
        
            upButton.setFillStyle(0xffffff);
        
        });
    
        upButton.on('pointerup', function () {

            upPressed = false;
        
            upButton.setFillStyle(0xaa00ff);
        
        });
    
        upButton.on('pointerout', function () {

            upPressed = false;
        
            upButton.setFillStyle(0xaa00ff);
        
        });

    // Botón abajo
        downButton = this.add.circle(200, 690, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(192, 675, '▼', {
            fontSize: '28px',
            fill: '#ffffff'
        });

        downButton.setInteractive();
        downButton.setAlpha(0.6);
        downButton.on('pointerdown', function () {

            downPressed = true;
        
            downButton.setFillStyle(0xffffff);
        
        });
    
        downButton.on('pointerup', function () {

            downPressed = false;
        
            downButton.setFillStyle(0xaa00ff);
        
        });
    
        downButton.on('pointerout', function () {

            downPressed = false;
        
            downButton.setFillStyle(0xaa00ff);
        
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
        walls.create(200, 89, null)
            .setDisplaySize(260, 15)
            .refreshBody();
            const topWall = this.add.rectangle(
                200,
                85,
                320,
                20,
                0x0088ff
            );
            
            topWall.setStrokeStyle(2, 0x88ccff);
            topWall.setVisible(false);

    // Pared inferior
        walls.create(200, 577, null)
            .setDisplaySize(300, 14)
            .refreshBody();
            const bottomWall = this.add.rectangle(
                200,
                580,
                320,
                20,
                0x0088ff
            );
            
            bottomWall.setStrokeStyle(2, 0x88ccff);
            bottomWall.setVisible(false);
    
    // Pared izquierda
        walls.create(55, 332.5, null)
            .setDisplaySize(13, 500)
            .refreshBody();
            const leftWall = this.add.rectangle(
                50,
                332.5,
                20,
                515,
                0x0088ff
            );
            
            leftWall.setStrokeStyle(2, 0x88ccff);
            leftWall.setVisible(false);
    
    // Pared derecha
        walls.create(346, 332.5, null)
            .setDisplaySize(13, 500)
            .refreshBody();
            const rightWall = this.add.rectangle(
                350,
                332.5,
                20,
                515,
                0x0088ff
            );
            
            rightWall.setStrokeStyle(2, 0x88ccff);
            rightWall.setVisible(false);
    // Pared interna horizontal
        walls.create(200, 220, null)
            .setDisplaySize(180, 20)
            .refreshBody();
            this.add.rectangle(200, 220, 180, 20, 0x0088ff)
            .setStrokeStyle(2, 0x88ccff);
    // Pared interna vertical
        walls.create(120, 390, null)
            .setDisplaySize(20, 220)
            .refreshBody();
            this.add.rectangle(120, 390, 20, 220, 0x0088ff)
            .setStrokeStyle(2, 0x88ccff);
    // Segunda pared vertical
        walls.create(280, 390, null)
            .setDisplaySize(20, 220)
            .refreshBody();
            this.add.rectangle(280, 390, 20, 220, 0x0088ff)
            .setStrokeStyle(2, 0x88ccff);
    
    // Colisión jugador-paredes
        this.physics.add.collider(player, walls);
    // Grupo de monedas
        coins = this.physics.add.group();

    // Moneda
        const coin = this.add.circle(200, 520, 10, 0xffff00);

        this.physics.add.existing(coin);

        coins.add(coin);
        coin.setStrokeStyle(2, 0xffffff);

        this.tweens.add({
        targets: coin,
        scaleX: 0.2,
        duration: 250,
        yoyo: true,
        repeat: -1
        });
    // Segunda moneda
        const coin2 = this.add.circle(80, 180, 10, 0xffff00);

        this.physics.add.existing(coin2);
    
        coins.add(coin2);
        coin2.setStrokeStyle(2, 0xffffff);

        this.tweens.add({
        targets: coin2,
        scaleX: 0.2,
        duration: 250,
        yoyo: true,
        repeat: -1
    });
    
    // Tercera moneda
        const coin3 = this.add.circle(320, 180, 10, 0xffff00);
    
        this.physics.add.existing(coin3);
    
        coins.add(coin3);
        coin3.setStrokeStyle(2, 0xffffff);

        this.tweens.add({
        targets: coin3,
        scaleX: 0.2,
        duration: 250,
        yoyo: true,
        repeat: -1
    });
    
    // Cuarta moneda
        const coin4 = this.add.circle(200, 360, 10, 0xffff00);
    
        this.physics.add.existing(coin4);
    
        coins.add(coin4);
        coin4.setStrokeStyle(2, 0xffffff);

        this.tweens.add({
        targets: coin4,
        scaleX: 0.2,
        duration: 250,
        yoyo: true,
        repeat: -1
    });

// Recoger moneda
    this.physics.add.overlap(player, coins, collectCoin, null, this);
        // Grupo de trampas
        traps = this.physics.add.group();

// Trampa roja móvil
    // Glow exterior
    const trapGlow = this.add.circle(200, 430, 28, 0x440000)
    .setAlpha(0.35);

// Glow medio
    const trapGlow2 = this.add.circle(200, 430, 20, 0xff2200)
    .setAlpha(0.4);

// Trampa principal
    movingTrap = this.add.circle(200, 430, 15, 0xff0000);

    movingTrap.setStrokeStyle(2, 0xffffff);
    mineSprite = this.add.image(
        movingTrap.x,
        movingTrap.y,
        'mine'
    );
    
    mineSprite.setScale(0.04);
    mineSprite.setDepth(60);
    mineSprite.setVisible(false);

// Unir glows a la trampa
movingTrap.glowOuter = trapGlow;
movingTrap.glowMiddle = trapGlow2;

    this.physics.add.existing(movingTrap);

    movingTrap.body.setCircle(15);

    movingTrap.body.setImmovable(true);

    traps.add(movingTrap);
    
// Colisión con trampa
        this.physics.add.overlap(player, traps, hitTrap, null, this);
// Glow exterior salida
const exitGlow = this.add.circle(200, 133, 35, 0x00ffcc)
    .setAlpha(0.25);

// Glow medio
const exitGlow2 = this.add.circle(200, 133, 24, 0x00ffff)
    .setAlpha(0.35);

// Núcleo del portal
exit = this.add.circle(200, 133, 16, 0xffffff);

exit.setStrokeStyle(4, 0x00ffff);
// Animación portal
this.tweens.add({

    targets: exit,

    scale: 0.55,

    duration: 1400,

    yoyo: true,

    repeat: -1

});

this.physics.add.existing(exit);

// Llegar a la salida
    this.physics.add.overlap(player, exit, reachExit, null, this);

}

function update(){

    if(!player.body.enable){
        return;
    }

// Esperar START
    if(!gameStarted){
        player.body.setVelocity(0);
        return;
    }

    player.body.setVelocity(0);
// Actualizar posición de glows
// Centrar punto indicador
    playerEye.x = player.x;
    playerEye.y = player.y;
    player.glowOuter.x = player.x;
    player.glowOuter.y = player.y;

    player.glowMiddle.x = player.x;
    player.glowMiddle.y = player.y;

    const speed = 250;

touchActive = this.input.activePointer.isDown;

if(touchActive){

    touchX = this.input.activePointer.x;
    touchY = this.input.activePointer.y;

}

if(touchActive && touchY < 600){

    if(touchX < player.x - 10){
        player.body.setVelocityX(-speed);
    }
    
    if(touchX > player.x + 10){
        player.body.setVelocityX(speed);
    }
    
    if(touchY < player.y - 10){
        player.body.setVelocityY(-speed);
    }
    
    if(touchY > player.y + 10){
        player.body.setVelocityY(speed);
    }

}

    if(
        cursors.left.isDown ||
        leftPressed
    ){
        player.body.setVelocityX(-speed);
    
        playerEye.x = player.x - 15;
        playerEye.y = player.y;
    }

    if(
        cursors.right.isDown ||
        rightPressed
    ){
        player.body.setVelocityX(speed);
    
        playerEye.x = player.x + 15;
        playerEye.y = player.y;
    }

    if(
        cursors.up.isDown ||
        upPressed
    ){
        player.body.setVelocityY(-speed);
    
        playerEye.x = player.x;
        playerEye.y = player.y - 15;
    }

    if(
        cursors.down.isDown ||
        downPressed
    ){
        player.body.setVelocityY(speed);
    
        playerEye.x = player.x;
        playerEye.y = player.y + 15;
    }
// Movimiento de trampa
        movingTrap.x += 2 * trapDirection;
// Actualizar glow de la trampa
    movingTrap.glowOuter.x = movingTrap.x;
    movingTrap.glowOuter.y = movingTrap.y;

    movingTrap.glowMiddle.x = movingTrap.x;
    movingTrap.glowMiddle.y = movingTrap.y;

// Cambiar dirección
    if(movingTrap.x > 245){
            trapDirection = -1;
    }
    
    if(movingTrap.x < 155){
            trapDirection = 1;
    }
    if (player.body.velocity.x < 0) {
        playerSprite.setTexture('playerLeft');
    }
    else if (player.body.velocity.x > 0) {
        playerSprite.setTexture('playerRight');
    }
    else if (player.body.velocity.y < 0) {
        playerSprite.setTexture('playerUp');
    }
    else if (player.body.velocity.y > 0) {
        playerSprite.setTexture('playerDown');
    }
    else {
        playerSprite.setTexture('playerFront');
    }
    if (playerSprite) {
        playerSprite.x = player.x;
        playerSprite.y = player.y;
    }
    if (mineSprite) {
        mineSprite.x = movingTrap.x;
        mineSprite.y = movingTrap.y;
    }

}
function collectCoin(player, coin){

// Flash de moneda
const flash = player.scene.add.circle(
    coin.x,
    coin.y,
    12,
    0xffff66
);

flash.setAlpha(0.9);

// Animación flash
player.scene.tweens.add({

    targets: flash,

    scale: 3,

    alpha: 0,

    duration: 250,

    onComplete: function(){

        flash.destroy();

    }

});

// Eliminar moneda
coin.destroy();
coinSound.play();

// Puntaje
score += 10;

coinsRemaining--;

scoreText.setText('Puntos: ' + score);

}

function hitTrap(player, trap){

    player.body.setVelocity(0);
// Detener música
music.stop();

// Sonido explosión
explodeSound.play({
    volume: 0.4
});
// Temblor cámara
player.scene.cameras.main.shake(
    300,
    0.01
);

// Ocultar mina
trap.setVisible(false);
trap.glowOuter.setVisible(false);

trap.glowMiddle.setVisible(false);
// Explosión de la mina
const trapBoom = player.scene.add.circle(
    trap.x,
    trap.y,
    18,
    0xff0000
);

trapBoom.setAlpha(0.9);
// Partículas de la mina
for(let i = 0; i < 10; i++){

    const trapParticle = player.scene.add.circle(
        trap.x,
        trap.y,
        Phaser.Math.Between(2, 4),
        0xffff00
    );

    trapParticle.setAlpha(0.9);

    const angle =
        Phaser.Math.FloatBetween(0, Math.PI * 2);

    const distance =
        Phaser.Math.Between(30, 70);

    const targetX =
        trap.x + Math.cos(angle) * distance;

    const targetY =
        trap.y + Math.sin(angle) * distance;

    player.scene.tweens.add({

        targets: trapParticle,

        x: targetX,

        y: targetY,

        alpha: 0,

        scale: 0.2,

        duration: 700,

        onComplete: function(){

            trapParticle.destroy();

        }

    });

}

player.scene.tweens.add({

    targets: trapBoom,

    scale: 5,

    alpha: 0,

    duration: 450,

    onComplete: function(){

        trapBoom.destroy();

    }

});

// Ocultar jugador
player.setVisible(false);
playerSprite.setVisible(false);
playerEye.setVisible(false);

player.glowOuter.setVisible(false);

player.glowMiddle.setVisible(false);

// Explosión
const boom = player.scene.add.circle(
    player.x,
    player.y,
    20,
    0xffffff
);

boom.setAlpha(0.9);
// Partículas pequeñas
for(let i = 0; i < 12; i++){

    const particle = player.scene.add.circle(
        player.x,
        player.y,
        Phaser.Math.Between(2, 5),
        0xff6600
    );

    particle.setAlpha(0.9);

    // Movimiento aleatorio
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);

    const distance = Phaser.Math.Between(40, 90);

    const targetX =
        player.x + Math.cos(angle) * distance;

    const targetY =
        player.y + Math.sin(angle) * distance;

    // Animación partícula
    player.scene.tweens.add({

        targets: particle,

        x: targetX,

        y: targetY,

        alpha: 0,

        scale: 0.2,

        duration: 500,

        onComplete: function(){

            particle.destroy();

        }

    });

}

// Animación explosión
player.scene.tweens.add({

    targets: boom,

    scale: 6,

    alpha: 0,

    duration: 500,

    onComplete: function(){

        boom.destroy();

    }

});

// Detener movimiento
player.body.enable = false;

// Detener música
music.stop();

// Cambiar color

// Mensaje final
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

// Detener música
music.stop();

// Sonido victoria
winSound.play();
// Detener al jugador
player.body.setVelocity(0);
player.body.enable = false;

if (playerSprite) {
    playerSprite.setTexture('playerFront');
}
// Ocultar jugador
player.setVisible(false);

if (playerSprite) {
    playerSprite.setVisible(false);
}

playerEye.setVisible(false);
player.glowOuter.setVisible(false);
player.glowMiddle.setVisible(false);

// Ocultar mina
movingTrap.setVisible(false);

if (mineSprite) {
    mineSprite.setVisible(false);
}

movingTrap.glowOuter.setVisible(false);
movingTrap.glowMiddle.setVisible(false);

// Esperar 1 segundo antes de mostrar el final
setTimeout(function(){

    // Mensaje final
    messageText.setText('LEVEL\nCOMPLETE');

    restartText = player.scene.add.text(
        200,
        460,
        'RESTART',
        {
            fontSize: '30px',
            fill: '#ffffff',
            backgroundColor: '#5500aa',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        }
    );

    restartText.setOrigin(0.5);
    restartText.setInteractive();

    restartText.on('pointerdown', function(){

        location.reload();

    });

    nextLevelText = player.scene.add.text(
        200,
        530,
        'NEXT LEVEL',
        {
            fontSize: '30px',
            fill: '#ffffff',
            backgroundColor: '#0088ff',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        }
    );

    nextLevelText.setOrigin(0.5);
    nextLevelText.setInteractive();

    nextLevelText.on('pointerdown', function(){

        messageText.setText('LEVEL 2\nCOMING SOON');

    });

}, 1000);

}

function updateTimer(){
    if(!gameStarted){
        return;
    }
    

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
