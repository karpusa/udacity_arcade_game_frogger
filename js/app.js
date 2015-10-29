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

var randomNumber = function(range) {
    return Math.floor(Math.random() * range);
};

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.initPosition();
    this.resetSpeed();
};


/**
* Reset enemy position
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
    if (FIELD_WIDTH<this.x)  {
        this.resetPosition();
        this.resetSpeed();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

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
};

/**
* Resets player to starting position
*/
Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
};

Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite[0]), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch(key) {
        case 'left':
            var leftPos = this.x - PLAYER_MOVE_X;
            if (leftPos >= PLAYER_MIN_X_POS) {
                this.x = leftPos;
            };
            break;
        case 'up':
            var upPos = this.y - PLAYER_MOVE_Y;
            if (upPos >= PLAYER_MIN_Y_POS) {
                this.y = upPos;
            };
            break;
        case 'right':
            var rightPos = this.x + PLAYER_MOVE_X;
            if (rightPos <= PLAYER_MAX_X_POS) {
                this.x = rightPos;
            };
            break;
        case 'down':
            var downPos = this.y + PLAYER_MOVE_Y;
            if (downPos <= PLAYER_MAX_Y_POS) {
                this.y = downPos;
            };
            break;
        default:
            return;
    }
};


/**
* Create instances of enemies in the game
*
*/
function createEnemies(number) {
    for (i = 0; i < number; i++) {
        var enemy = new Enemy();
        allEnemies.push(enemy);
    }
}

function resetEnemies() {
    allEnemies = [];
}

var player = new Player();
allEnemies = [];
createEnemies(3);


// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
