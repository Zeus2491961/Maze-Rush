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
let startStars = [];

function create(){
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
startBackground = this.add.rectangle(
    200,
    425,
    400,
    850,
    0x000000
);

startBackground.setAlpha(1);

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
// Título del juego
    titleText = this.add.text(
    200,
    250,
    'CYBER\nMAZE',
    {
        fontSize: '48px',
        fill: '#00ffff',
        fontStyle: 'bold',
        align: 'center'
    }
);

titleText.setOrigin(0.5);
titleText.setDepth(2);

// Botón START
startText = this.add.text(
    200,
    420,
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
// Acción botón START
startText.on('pointerdown', function(){

    gameStarted = true;

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

// Fade título
titleText.scene.tweens.add({

    targets: titleText,

    alpha: 0,

    duration: 800,

    onComplete: function(){

        titleText.destroy();

    }

});

// Fade START
startText.scene.tweens.add({

    targets: startText,

    alpha: 0,

    duration: 800,

    onComplete: function(){

        startText.destroy();

    }

});
});
// Botón izquierda
        leftButton = this.add.circle(140, 690, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(130, 675, '◀', {
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
        rightButton = this.add.circle(260, 690, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(252, 675, '▶', {
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
        upButton = this.add.circle(200, 640, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(192, 625, '▲', {
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
        downButton = this.add.circle(200, 740, 28, 0x8800ff)
        .setStrokeStyle(3, 0xdd88ff);
        this.add.text(192, 725, '▼', {
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
        walls.create(200, 85, null)
            .setDisplaySize(320, 20)
            .refreshBody();
            const topWall = this.add.rectangle(
                200,
                85,
                320,
                20,
                0x0088ff
            );
            
            topWall.setStrokeStyle(2, 0x88ccff);

    // Pared inferior
        walls.create(200, 580, null)
            .setDisplaySize(320, 20)
            .refreshBody();
            const bottomWall = this.add.rectangle(
                200,
                580,
                320,
                20,
                0x0088ff
            );
            
            bottomWall.setStrokeStyle(2, 0x88ccff);
    
    // Pared izquierda
        walls.create(50, 332.5, null)
            .setDisplaySize(20, 515)
            .refreshBody();
            const leftWall = this.add.rectangle(
                50,
                332.5,
                20,
                515,
                0x0088ff
            );
            
            leftWall.setStrokeStyle(2, 0x88ccff);
    
    // Pared derecha
        walls.create(350, 332.5, null)
            .setDisplaySize(20, 515)
            .refreshBody();
            const rightWall = this.add.rectangle(
                350,
                332.5,
                20,
                515,
                0x0088ff
            );
            
            rightWall.setStrokeStyle(2, 0x88ccff);
            
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

// Puntaje
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

// Desactivar movimiento
player.body.enable = false;

// Ocultar portal
exit.destroy();

// Cambiar color jugador
player.setFillStyle(0xffffff);

// Explosión energética
const explosion = player.scene.add.circle(
    exit.x,
    exit.y,
    20,
    0x00ffff
);

explosion.setAlpha(0.8);

// Animación explosión
player.scene.tweens.add({

    targets: explosion,

    scale: 6,

    alpha: 0,

    duration: 600,

    onComplete: function(){

        explosion.destroy();

    }

});

// Mensaje final
messageText.setText('LEVEL\nCOMPLETE');

setTimeout(function(){

    location.reload();

}, 1500);

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
