"use strict";

var ENEMY_RESET_START_X = -101;
var ENEMY_START_X = [-101, 0, 101, 202, 303, 404, 505];
var ENEMY_START_Y = [62, 144, 228];
var SPEEDS = [100, 160, 220, 280, 360];
var PLAYER_START_X = 202;
var PLAYER_START_Y = 404;
var FIELD_WIDTH = 606;
var FIELD_HEIGHT = 606;
var PLAYER_MOVE_X = 101;
var PLAYER_MOVE_Y = 83;
var PLAYER_MIN_X_POS = 0;
var PLAYER_MIN_Y_POS = -30;
var PLAYER_MAX_X_POS = FIELD_WIDTH-PLAYER_MOVE_X;
var PLAYER_MAX_Y_POS = FIELD_HEIGHT-(PLAYER_MOVE_Y*2);
var CREATE_ENEMIES = 5;

/**
* Random number 0 - range
*/
var randomNumber = function(range) {
    return Math.floor(Math.random() * range);
};

/**
* Creates the Enemy object
*/
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.initPosition();
    this.resetSpeed();
};


/**
* Initilization enemy position
*/
Enemy.prototype.initPosition = function() {
    this.setPosition(this.getXCoordRandom(), this.getYCoordRandom());
};

/**
* Reset enemy position
*/
Enemy.prototype.resetPosition = function() {
    this.setPosition(ENEMY_RESET_START_X, this.getYCoordRandom());
};

/**
* Set enemy position x, y
*/
Enemy.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
* Random enemy speed
*/
Enemy.prototype.resetSpeed = function() {
    this.speed = SPEEDS[randomNumber(SPEEDS.length)];
};

/**
* Random Y position enemy start
*/
Enemy.prototype.getYCoordRandom = function() {
    return ENEMY_START_Y[randomNumber(ENEMY_START_Y.length)];
};

/**
* Random Y position enemy start
*/
Enemy.prototype.getXCoordRandom = function() {
    return ENEMY_START_X[randomNumber(ENEMY_START_X.length)];
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x+= this.speed*dt;
    //console.log(this.speed*dt);
    if (FIELD_WIDTH<this.x)  {
        this.resetPosition();
        this.resetSpeed();
    }
    this.collision();
};

/**
* Check enemy collision with player
*/
Enemy.prototype.collision = function() {
    if ((this.x >= player.x-101+26) && (this.x<=player.x+101-26) &&
        (this.y >= player.y-83+26) && (this.y <= player.y+83-26)) {
            gameEnd('end');
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* Creates the Player object
*/
var Player = function() {
    this.sprite = ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ];
    this.lifeSprite = 'images/heart.png';
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    this.play = true;
};

/**
* Resets player to starting position
*/
Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
};

/**
* Return if player can play game
*/
Player.prototype.canPlay = function() {
    return this.play;
};

/**
* Stop game or start new
*/
Player.prototype.setPlay = function(status) {
    if (status===false) {
        resetEnemies();
        this.reset();
        soundGameMusic.stop();
        soundGameEnd.play();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createEnemies(CREATE_ENEMIES);
        soundGameMusic.play();
        soundGameEnd.stop();
    }
    this.play = status;
};

/**
* Determines wheter player has fallen into water
*/
Player.prototype.update = function() {
    if (this.y <= 0) {
        gameEnd('win');
    }
}

/**
* Draw the player on the screen
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[0]), this.x, this.y);
};

/**
* Handles keyboard controls for player
*/
Player.prototype.handleInput = function(key) {
    if (!this.canPlay()) {
        if (key==="space") {
            this.setPlay(true);
        }
        return;
    }
    switch(key) {
        case 'left':
            var leftPos = this.x - PLAYER_MOVE_X;
            if (leftPos >= PLAYER_MIN_X_POS) {
                this.x = leftPos;
            }
            break;
        case 'up':
            var upPos = this.y - PLAYER_MOVE_Y;
            if (upPos >= PLAYER_MIN_Y_POS) {
                this.y = upPos;
            }
            break;
        case 'right':
            var rightPos = this.x + PLAYER_MOVE_X;
            if (rightPos <= PLAYER_MAX_X_POS) {
                this.x = rightPos;
            }
            break;
        case 'down':
            var downPos = this.y + PLAYER_MOVE_Y;
            if (downPos <= PLAYER_MAX_Y_POS) {
                this.y = downPos;
            }
            break;
        default:
            return;
    }
};


/**
* Create instances of enemies in the game
*/
function createEnemies(number) {
    for (var i = 0; i < number; i++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    }
}

/**
* Remove enemies in the game
*/
function resetEnemies() {
    allEnemies = [];
}

/**
* Show text on screen
*/
function showText(text, size, x, y) {
    ctx.font = size+"px Arial";
    ctx.fillStyle = "red";

    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}
/**
* Game end at Win or Game over
*/
function gameEnd(status) {
    if (status==='win') {
        showText('You win!', 30, canvas.width/2, 22);
    } else {
        showText('Game over!', 30, canvas.width/2, 22);
    }
    player.setPlay(false);
    showText('Press spacebar to play again!', 22, canvas.width/2, 44);
}


var player = new Player(),
    allEnemies = [];
createEnemies(CREATE_ENEMIES);

soundGameMusic.play();

// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
