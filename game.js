let canvas;
let ctx;
const width = 1000;
const height = 600;
let arr = [];
let arrCiv = [];
let arrFollow = [];
let arrBullet = [];
let x, y, xx, yy, myHeight, myWidth, eHeight, eWidth, cHeight, cWidth;

let shootUp = false;
let shootDown = false;
let shootRight = false;
let shootLeft = false;
let ammoPistol = 0;
let degreesP = 0;

let moveThis;
let moveRandom = Math.floor(Math.random() * 4);
let moveRandomSide = Math.floor(Math.random() * 4);
let initial = false;
let gotHit = false;
let score = 0;
let running = false;
let win = false;
let degrees = 0
let offsetX = 500
let offsetY = 300
let maxEnemies = 7;
let screenStart = true;

let spawn = Math.floor(Math.random() * 4);
if (spawn == 0) { // left
    cx = Math.floor(Math.random() * 1);
    cy = Math.floor(Math.random() * 599);
}
if (spawn == 1) { // right
    cx = Math.floor(Math.random() * (951 - 950)) + 950;
    cy = Math.floor(Math.random() * 599);
}
if (spawn == 2) { // up
    cx = Math.floor(Math.random() * 999);
    cy = Math.floor(Math.random() * (1 - 0)) + 0;
}
if (spawn == 3) { // down
    cx = Math.floor(Math.random() * 999);
    cy = Math.floor(Math.random() * (551 - 550)) + 550;
}

let spaceShip = new Image();
spaceShip.src = "spaceShip.png";

let img = new Image();
img.src = "asteroidBrown.png";

let img1 = new Image();
img1.src = "alienEnemy.png";

let bg = new Image();
bg.src = "background.png";

let spaceStation = new Image();
spaceStation.src = "spaceStation.png";

let laserImg = new Image();
laserImg.src = "laser.png";

let bg1 = new Image();
bg1.src = "startScreen.png";

function startGame() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    x = 500;
    y = 300;
    xx = Math.floor(Math.random() * 999);
    yy = Math.floor(Math.random() * 599);
    xf = Math.floor(Math.random() * 999);
    yf = Math.floor(Math.random() * 599);
    myHeight = 40;
    myWidth = 40;
    eHeight = 60;
    eWidth = 60;
    cHeight = 40;
    cWidth = 40;
    fHeight = 35;
    fWidth = 35;
    offsetX = x + 10
    offsetY = y + 10
    move();
    let newGuy = new myUnit(x, y, myHeight, myWidth, degrees, offsetX, offsetY);
    newGuy.draw();
    playAgain();
    startScreen();
}

function myUnit(x, y, myHeight, myWidth, degrees, offsetX, offsetY) { // unit you move
    this.x = x;
    this.y = y;
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.height = myHeight;
    this.width = myWidth;
    this.degrees = degrees
    this.draw = function () {
        ctx.beginPath();
        ctx.save();
        ctx.fillStyle = "lightgreen";
        ctx.translate(this.x, this.y)
        ctx.globalAlpha = 0.0;
        ctx.rect(0, 0, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(this.offsetX, this.offsetY)
        ctx.rotate(degrees * Math.PI / 180)
        ctx.drawImage(spaceShip, -45, -60, this.width + 80, this.height + 80);
        ctx.restore();
    }
}

function enemy(cx, cy, dir, eHeight, eWidth) {
    this.cx = cx;
    this.cy = cy;
    this.dir = dir;
    this.height = eHeight;
    this.width = eWidth;
    this.draw = function () {
        ctx.beginPath();
        ctx.save();
        ctx.drawImage(img, this.cx - 15, this.cy - 20, this.width + 20, this.height + 20);
        ctx.fillStyle = "red";
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.0;
        ctx.rect(this.cx, this.cy, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}

function enemyFollow(xf, yf, fHeight, fWidth, fHealth) {
    this.xf = xf;
    this.yf = yf;
    this.height = fHeight;
    this.width = fWidth;
    this.health = fHealth
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(img1, this.xf - 30, this.yf - 20, this.width + 60, this.height + 60);
        ctx.fillStyle = "white";
        ctx.save();
        ctx.globalAlpha = 0.0;
        ctx.rect(this.xf, this.yf, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}

function Civilian(xx, yy, cHeight, cWidth) {
    this.xx = xx;
    this.yy = yy;
    this.height = cHeight;
    this.width = cWidth;
    this.draw = function () {
        ctx.beginPath();
        ctx.save();
        ctx.drawImage(spaceStation, this.xx - 15, this.yy - 12, this.width + 10, this.height + 10);
        ctx.fillStyle = "lightblue";
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.0;
        ctx.rect(this.xx, this.yy, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}

function projectileThing(xp, yp, degreesP) {
    this.xp = xp + 15;
    this.yp = yp + 15;
    this.height = 10;
    this.width = 10;
    this.degreesP = degreesP
    this.draw = function () {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.xp, this.yp)
        ctx.fillStyle = "white";
        ctx.rotate(degreesP * Math.PI / 180)
        ctx.drawImage(laserImg, 0, -15, this.width + 25, this.height + 25);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.0;
        ctx.translate(this.xp, this.yp)
        ctx.rect(0, 0, this.width, this.height);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
    }
}

function shootProjectile() {
    xp = x;
    yp = y;
    let shoot = new projectileThing(xp, yp, degreesP);
    shoot.draw();
    arrBullet.push(shoot);
    console.log(arrBullet);
}

function addCiv() {
    xx = Math.floor(Math.random() * 950);
    yy = Math.floor(Math.random() * 550);
    let newCiv = new Civilian(xx, yy, cHeight, cWidth);
    newCiv.draw();
    arrCiv.push(newCiv);
    console.log(arrCiv);
}

function addenemy() {
    cx = Math.floor(Math.random() * 1000);
    cy = Math.floor(Math.random() * 600);
    dir = Math.floor(Math.random() * 4);
    let makeNew = new enemy(cx, cy, dir, eHeight, eWidth);
    makeNew.draw();
    arr.push(makeNew);
    console.log(arr);
}

function addFollow() {
    xf = Math.floor(Math.random() * 1000);
    yf = Math.floor(Math.random() * 600);
    fHealth = 2;
    let newFollow = new enemyFollow(xf, yf, fHeight, fWidth, fHealth);
    newFollow.draw();
    arrFollow.push(newFollow);
}

function updateText() {
    ctx.clearRect(0, 0, 1000, 600);
    if (screenStart == true) {
        ctx.drawImage(bg1, 0, 0, 1000, 600)
        ctx.fillStyle = "white"
    }
    if (screenStart == false) {
        ctx.drawImage(bg, 0, 0, 1000, 600)
    }
    if (ammoPistol > 0) {
        ctx.save();
        ctx.font = "10px Arial"
        ctx.fillStyle = "white";
        ctx.fillText("ammo " + ammoPistol, x, y - 20)
        ctx.restore();
    }
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 25, 25);
    if (screenStart == false) {
        if (maxEnemies > 0) {
            ctx.save();
            ctx.font = "10px Arial"
            ctx.fillStyle = "white";
            ctx.fillText("Enemies left: " + maxEnemies, 25, 40);
        }
    }

}

function updateGame() { // main game loop
    screenStart = false;
    ctx.clearRect(0, 0, 1000, 600);
    ctx.drawImage(bg, 0, 0, 1000, 600)
    updateText();
    let newGuy = new myUnit(x, y, myHeight, myWidth, degrees, offsetX, offsetY);
    newGuy.draw();
    score += 1;

    if (initial == false) { // only spawn one at the start
        addenemy();
        addCiv();
        addFollow();
        initial = true;
    }

    for (i = 0; i < arrBullet.length; i++) {
        arrBullet[i].draw();
    }

    // orange square that follows you
    for (i = 0; i < arrFollow.length; i++) {
        arrFollow[i].draw();
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "15px Arial"
        ctx.fillText("Health " + arrFollow[i].health, arrFollow[i].xf - 10, arrFollow[i].yf - 15)
        ctx.restore();

        if (newGuy.x <= arrFollow[i].xf && arrFollow[i].xf >= 20) { // left
            arrFollow[i].xf -= 1;
        }
        if (newGuy.x >= arrFollow[i].xf && arrFollow[i].xf <= 980) { // right
            arrFollow[i].xf += 1;
        }
        if (newGuy.y >= arrFollow[i].yf && arrFollow[i].yf <= 580) { // down
            arrFollow[i].yf += 1;
        }
        if (newGuy.y <= arrFollow[i].yf && arrFollow[i].yf >= 20) { // up
            arrFollow[i].yf -= 1;
        }

        if (arrFollow.length <= 2 && maxEnemies > 0) { // how many orange squares you want to add
            addFollow();
            console.log(arrFollow)
        }

        // hit detection
        if (arrFollow[i].xf < newGuy.x + newGuy.width &&
            arrFollow[i].xf + arrFollow[i].width > newGuy.x &&
            arrFollow[i].yf < newGuy.y + newGuy.height &&
            arrFollow[i].yf + arrFollow[i].height > newGuy.y) {
            gameOver();
        }

        // hit detection bullets on arrFollow
        for (j = 0; j < arrBullet.length; j++) {
            if (arrFollow[i].xf < arrBullet[j].xp + arrBullet[j].width &&
                arrFollow[i].xf + arrFollow[i].width > arrBullet[j].xp &&
                arrFollow[i].yf < arrBullet[j].yp + arrBullet[j].height &&
                arrFollow[i].yf + arrFollow[i].height > arrBullet[j].yp) {
                arrBullet.splice(j, 1)
                arrFollow[i].health -= 1;
                if (arrFollow[i].health < 1) {
                    arrFollow.splice(i, 1);
                    maxEnemies -= 1;
                }
            }
        }
    }

    if (arrFollow.length == 0 && gotHit == false) {
        victory();
    }

    // blue squares that you pick up and get extra points
    for (i = 0; i < arrCiv.length; i++) {
        arrCiv[i].draw();
        if (arrCiv.length <= 4) {
            addCiv();
            console.log(arrCiv)
        }
        if (arrCiv[i].xx < newGuy.x + newGuy.width &&
            arrCiv[i].xx + arrCiv[i].width > newGuy.x &&
            arrCiv[i].yy < newGuy.y + newGuy.height &&
            arrCiv[i].yy + arrCiv[i].height > newGuy.y) {
            score += 1000;
            ammoPistol = 5;
            arrCiv.splice(i, 1);

        }
    }

    for (i = 0; i < arr.length; i++) { // hit detection
        if (arr[i].cx < newGuy.x + newGuy.width &&
            arr[i].cx + arr[i].width > newGuy.x &&
            arr[i].cy < newGuy.y + newGuy.height &&
            arr[i].cy + arr[i].height > newGuy.y) {
            gameOver();

        }
    }
    for (j = 0; j < arrBullet.length; j++) {
        for (i = 0; i < arr.length; i++) { // hit detection
            if (arr[i].cx < arrBullet[j].xp + arrBullet[j].width &&
                arr[i].cx + arr[i].width > arrBullet[j].xp &&
                arr[i].cy < arrBullet[j].yp + arrBullet[j].height &&
                arr[i].cy + arr[i].height > arrBullet[j].yp) {
                arrBullet.splice(j, 1)
                arr.splice(i, 1);
            }
        }
    }

    if (score % 200 == 0) { // if original hits the edge spawn another enemy
        addenemy()
    }

    for (i = 0; i < arr.length; i++) {

        if (arr[i].cy >= 600 || arr[i].cx <= 0 || arr[i].cx >= 1000 || arr[i].cy <= 0) { // hits any of the edges

            moveRandomSide = Math.floor(Math.random() * 4);

            if (moveRandomSide == 0) { // random location on top
                arr[i].cx = Math.floor(Math.random() * 999);
                arr[i].cy = Math.floor(Math.random() * (1 - 0)) + 0;
                arr[i].dir = Math.floor(Math.random() * 4);
                arr[i].draw();
            }
            else if (moveRandomSide == 1) { // random location on bottom
                arr[i].cx = Math.floor(Math.random() * 999);
                arr[i].cy = Math.floor(Math.random() * (551 - 550)) + 550;
                arr[i].dir = Math.floor(Math.random() * 4);
                arr[i].draw();
            }
            else if (moveRandomSide == 2) { // random location on left
                arr[i].cx = Math.floor(Math.random() * 1);
                arr[i].cy = Math.floor(Math.random() * 599);
                arr[i].dir = Math.floor(Math.random() * 4);
                arr[i].draw();
            }
            else if (moveRandomSide == 3) { // random location on right
                arr[i].cx = Math.floor(Math.random() * (951 - 950)) + 950;
                arr[i].cy = Math.floor(Math.random() * 599);
                arr[i].dir = Math.floor(Math.random() * 4);
                arr[i].draw();
            }
        }
    }

    for (i = 0; i < arr.length; i++) {
        if (arr[i].dir == 0) { // direction up 
            arr[i].cy -= 2;
            arr[i].draw();
        }
        else if (arr[i].dir == 1) { // direction down 
            arr[i].cy += 2;
            arr[i].draw();
        }
        else if (arr[i].dir == 2) { // direction left
            arr[i].cx -= 2;
            arr[i].draw();
        }
        else if (arr[i].dir == 3) { // direction right
            arr[i].cx += 2;
            arr[i].draw();
        }
    }

    if (shootUp == true) {
        for (i = 0; i < arrBullet.length; i++) {
            arrBullet[i].yp -= 10;
            if (arrBullet[i].yp < 1) {
                arrBullet.splice(i, 1)
                console.log(arrBullet);
            }
        }
    }
    if (shootDown == true) {
        for (i = 0; i < arrBullet.length; i++) {
            arrBullet[i].yp += 10;
            if (arrBullet[i].yp > 599) {
                arrBullet.splice(i, 1)
                console.log(arrBullet);
            }
        }
    }
    if (shootLeft == true) {
        for (i = 0; i < arrBullet.length; i++) {
            arrBullet[i].xp -= 10;
            if (arrBullet[i].xp < 1) {
                arrBullet.splice(i, 1)
                console.log(arrBullet);
            }
        }
    }
    if (shootRight == true) {
        for (i = 0; i < arrBullet.length; i++) {
            arrBullet[i].xp += 10;
            if (arrBullet[i].xp > 999) {
                arrBullet.splice(i, 1)
                console.log(arrBullet);
            }
        }
    }


}

function redraw() {
    for (i = 0; i < arr.length; i++) {
        arr[i].draw();
    }
    for (j = 0; j < arrFollow.length; j++) {
        arrFollow[j].draw();
    }
    for (k = 0; k < arrCiv.length; k++) {
        arrCiv[k].draw();
    }
}

function move() { // moving your character
    addEventListener("keydown", function (event) {
        if (running == true) {
            if (event.keyCode == 68) { // right
                degrees = 90;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (screenStart == true) {
                    ctx.drawImage(bg1, 0, 0, 1000, 600)
                }
                if (screenStart == false) {
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                }

                ctx.save();
                updateText();
                let moveRight = new myUnit(x, y, myHeight, myWidth, degrees, offsetX, offsetY);
                moveRight.draw();
                if (x < 950) {
                    x += 50;
                    offsetX = x + 30
                    offsetY = y + 10
                    redraw()
                }
                ctx.restore();
            }

            if (event.keyCode == 65) { // left
                degrees = -90;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (screenStart == true) {
                    ctx.drawImage(bg1, 0, 0, 1000, 600)
                }
                if (screenStart == false) {
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                }

                ctx.save();
                updateText();
                let moveLeft = new myUnit(x, y);
                moveLeft.draw();
                if (x > 0) {
                    x -= 50;
                    offsetX = x + 10
                    offsetY = y + 30
                    redraw()
                }
                ctx.restore();
            }

            if (event.keyCode == 87) { // up
                degrees = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (screenStart == true) {
                    ctx.drawImage(bg1, 0, 0, 1000, 600)
                }
                if (screenStart == false) {
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                }

                ctx.save();
                updateText();
                let moveUp = new myUnit(x, y);
                moveUp.draw();
                if (y >= 50) {
                    y -= 50;
                    offsetX = x + 10
                    offsetY = y + 10
                    redraw()
                }
                ctx.restore();
            }

            if (event.keyCode == 83) { // down
                degrees = 180;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (screenStart == true) {
                    ctx.drawImage(bg1, 0, 0, 1000, 600)
                }
                if (screenStart == false) {
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                }

                ctx.save();
                updateText();
                let moveDown = new myUnit(x, y);
                moveDown.draw();
                if (y <= 500) {
                    y += 50;
                    offsetX = x + 30
                    offsetY = y + 30
                    redraw()
                }
                ctx.restore();
            }

            if (event.keyCode == 104) { // shoot up
                updateText();
                redraw()
                if (ammoPistol > 0) {
                    shootRight = false;
                    shootUp = true;
                    shootLeft = false;
                    shootDown = false;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                    ctx.save();
                    degreesP = -90;
                    yp = y;
                    shootProjectile()
                    ammoPistol -= 1;
                    redraw()
                    newGuy.draw();
                    ctx.restore();
                }
            }

            if (event.keyCode == 101) { // shoot down
                updateText();
                redraw()
                if (ammoPistol > 0) {
                    shootRight = false;
                    shootUp = false;
                    shootLeft = false;
                    shootDown = true;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                    ctx.save();
                    yp = y;
                    shootProjectile()
                    degreesP = 90;
                    ammoPistol -= 1;
                    redraw()
                    newGuy.draw();
                    ctx.restore();
                }
            }

            if (event.keyCode == 100) { // shoot left
                updateText();
                redraw()
                if (ammoPistol > 0) {
                    shootUp = false;
                    shootDown = false;
                    shootRight = false;
                    shootLeft = true;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                    ctx.save();
                    degreesP = 180;
                    xp = x;
                    shootProjectile()
                    ammoPistol -= 1;
                    redraw()
                    newGuy.draw();
                    ctx.restore();
                }
            }

            if (event.keyCode == 102) { // shoot right
                updateText();
                redraw()
                if (ammoPistol > 0) {
                    shootUp = false;
                    shootDown = false;
                    shootLeft = false;
                    shootRight = true
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(bg, 0, 0, 1000, 600)
                    ctx.save();
                    degreesP = 0;
                    xp = x;
                    shootProjectile()
                    ammoPistol -= 1;
                    redraw()
                    newGuy.draw();
                    ctx.restore();
                }
            }
        }
    });


}



function gameOver() { // should display when you get hit
    clearInterval(moveThis);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, 1000, 600)
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 400, 100);
    ctx.fillText("Highscore: " + score, 400, 125);
    ctx.restore();
    ctx.save();
    ctx.font = "15px Arial"
    ctx.fillText("CLICK SPACE TO PLAY AGAIN", 385, 550);
    ctx.restore()
    arr = [];
    arrFollow = [];
    arrCiv = [];
    arrBullet = [];
    ammoPistol = 0;
    running = false;
    gotHit = true;
    maxEnemies = 7
    playAgain();
}

function victory() {
    clearInterval(moveThis);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, 0, 0, 1000, 600)
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillText("Congratulations!! you have defeated all the aliens", 200, 100);
    ctx.fillText(" and saved humanity on station 1045!", 200, 125)
    ctx.fillText("Highscore: " + score, 400, 150);
    ctx.restore();
    ctx.save()
    ctx.font = "15px Arial"
    ctx.fillText("CLICK SPACE TO PLAY AGAIN", 385, 550);
    ctx.restore()
    arr = [];
    arrFollow = [];
    arrCiv = [];
    arrBullet = [];
    ammoPistol = 0;
    win = true;
    running = false;
    maxEnemies = 7;
    playAgain();
}

function playAgain() {
    addEventListener("keydown", function (event) {
        if (event.keyCode == 32) { // space
            if (running == false) {
                score = 0;
                running = true;
                gotHit = false;
                initial = false;
                moveThis = setInterval(updateGame, 10);
                startScreen = false;
            }
        }
    })
}



function startScreen() {
    ctx.drawImage(bg1, 0, 0, 1000, 600)
    playAgain();
    updateText();
    // title screen
    ctx.save()
    ctx.font = "30px Arial"
    ctx.fillStyle = "white"
    ctx.fillText("THE INVASION ON STATION 1045", 250, 50)
    ctx.restore()

    // center message
    ctx.save()
    ctx.font = "20px Arial"
    ctx.fillStyle = "white"
    ctx.fillText("PRESS SPACE TO START", 350, 300)
    ctx.restore()

    // hostile interaction
    ctx.save()
    ctx.font = "20px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText("Enemy Types", 50, 450)
    ctx.restore()

    xf = 50
    yf = 500
    fHealth = 2;
    let newFollow = new enemyFollow(xf, yf, fHeight, fWidth, fHealth);
    newFollow.draw();

    dir = 0;
    cx = 150
    cy = 500
    let makeNew = new enemy(cx, cy, dir, eHeight, eWidth);
    makeNew.draw();

    // friendly interaction
    ctx.save()
    ctx.font = "20px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText("Friendly Types", 300, 450)
    ctx.restore()

    ctx.save()
    ctx.font = "10px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText("Pickup to gain ammo", 310, 555)
    ctx.restore()

    xx = 350
    yy = 510
    let newCiv = new Civilian(xx, yy, cHeight, cWidth);
    newCiv.draw();

    // controllable types
    ctx.save()
    ctx.font = "20px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText("Your Ship", 520, 450)
    ctx.restore()

    x = 550;
    y = 520;
    offsetX = 550;
    offsetY = 520;
    let startShip = new myUnit(x, y, myHeight, myWidth, degrees, offsetX, offsetY);
    startShip.draw();

    // controls
    ctx.save()
    ctx.font = "20px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText("Controls", 800, 25)
    ctx.restore()

    ctx.save()
    ctx.font = "15px Verdana"
    ctx.fillStyle = "white"
    ctx.fillText("W,A,S,D to move", 800, 50)
    ctx.fillText("numpad 4865 to shoot", 800, 75)
    ctx.restore()
}
