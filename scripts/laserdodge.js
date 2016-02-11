var gameOver = true;
var pause = false;
var fullscreen = false;
var score = 0;

var ct;
var txtCt = null;

var svg_playground;
var gameField;
var playground = {
    width: 640,
    height: 640
}

var fps = 0;
var t0 = performance.now();

var star = null;
var clock = null;
var mine = null;

var gameLoopInterval = null;
var spawnMineTimer = null;
var spawnClockTimer = null;

var player = {
    obj: null,
    xPos: 0,
    yPos: 0,
    rad: 0,
    speed: {
        x: 0,
        y: 0,
        act: 0
    },
    GetX: function () {
        return parseInt(this.obj.getAttribute("cx"));
    },
    GetY: function () {
    return parseInt(this.obj.getAttribute("cy"));
    },
    SetX: function (x) {
        this.xPos = x;
        return this.obj.setAttribute("cx", parseFloat(x));
    },
    SetY: function (y) {
        this.yPos = y;
        return this.obj.setAttribute("cy", parseFloat(y));
    },
    GotHit: function (x1, y1, x2, y2) {
        var xlwidth = IntersectionLineWidth(this.xPos - this.rad, this.xPos + this.rad, x1, x2);
        var ylwidth = IntersectionLineWidth(this.yPos - this.rad, this.yPos + this.rad, y1, y2);

        if (xlwidth > 0 && ylwidth > 0) {
            return true;
        }

    },
    Move: function () {
        var xAcc = playerAcc;
        var yAcc = playerAcc;

        if (control.up) {
            player.speed.y -= yAcc;
            if (player.speed.y > 0) {
                player.speed.y -= playerBrk;
            }
        }

        if (control.down) {
            player.speed.y += yAcc;
            if (player.speed.y < 0) {
                player.speed.y += playerBrk;
            }
        }
        if (!control.down && !control.up) {
            if (player.speed.y > 0) {
                player.speed.y -= playerBrk;
                if (player.speed.y < 0) {
                    player.speed.y = 0;
                }
            } else if (player.speed.y < 0) {
                player.speed.y += playerBrk;
                if (player.speed.y > 0) {
                    player.speed.y = 0;
                }
            }
        }
        if (control.left) {
            player.speed.x -= xAcc;
            if (player.speed.x > 0) {
                player.speed.x -= playerBrk;
            }
        }
        if (control.right) {
            player.speed.x += xAcc;
            if (player.speed.x < 0) {
                player.speed.x += playerBrk;
            }
        }
        if (!control.left && !control.right) {
            if (player.speed.x > 0) {
                player.speed.x -= playerBrk;
                if (player.speed.x < 0) {
                    player.speed.x = 0;
                }
            } else if (player.speed.x < 0) {
                player.speed.x += playerBrk;
                if (player.speed.x > 0) {
                    player.speed.x = 0;
                }
            }
        }

        if (Math.sqrt(Math.pow(player.speed.x, 2) + Math.pow(player.speed.y, 2)) > playerMaxSpeed) {
            var ratio = GetSpeedRatio(player.speed.y, player.speed.x, playerMaxSpeed);
            player.speed.x = player.speed.x * ratio;
            player.speed.y = player.speed.y * ratio;
        }
        player.speed.act = Math.sqrt(Math.pow(player.speed.x, 2) + Math.pow(player.speed.y, 2));

        this.xPos += this.speed.x;
        this.yPos += this.speed.y;


        if (this.xPos >= playground.width) {
            this.xPos = 1;
        }
        if (this.xPos < 0) {
            this.xPos = playground.width-1;
        }
        if (this.yPos >= playground.height) {
            this.yPos = 1;
        }

        if (this.yPos < 0) {
            this.yPos = playground.height-1;
        }
        
        player.SetX(this.xPos);
        player.SetY(this.yPos);
        //moveSection(this.obj, this.xPos, this.yPos);
    }
};

var laser = {
    vert: null,
    horiz: null,
    width: 2,
    speed: {
        x: 0,
        y: 0,
        act: 0
    },
    Move: function () {
        var x = parseFloat(laser.vert.getAttribute("x"));
        var y = parseFloat(laser.horiz.getAttribute("y"));

        this.vert.setAttribute("x", (laser.speed.x + x));
        this.horiz.setAttribute("y", (laser.speed.y + y))


        if (x >= playground.width) {
            laser.speed.x *= (1 + ((Math.floor(Math.random()*(maxLaserChange-minLaserChange))+minLaserChange)/100));
            laser.speed.x = -laser.speed.x;
            this.vert.setAttribute("x", playground.width-1);
        }
        if (x <= 0) {
            laser.speed.x *= (1 + ((Math.floor(Math.random() * (maxLaserChange - minLaserChange)) + minLaserChange) / 100));
            laser.speed.x = -laser.speed.x;
            this.vert.setAttribute("x", 1);
        }

        if (y >= playground.height) {
            laser.speed.y *= (1 + ((Math.floor(Math.random() * (maxLaserChange - minLaserChange)) + minLaserChange) / 100));
            laser.speed.y = -laser.speed.y;
            this.horiz.setAttribute("y", playground.height - 1);
        }
        if (y <= 0) {
            laser.speed.y *= (1 + ((Math.floor(Math.random() * (maxLaserChange - minLaserChange)) + minLaserChange) / 100));
            laser.speed.y = -laser.speed.y;
            this.horiz.setAttribute("y", 1);
        }
    }
}

window.onload = function () {
    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', FullScreenChanged);
    svg_playground = document.getElementById("playground");
    gameField = document.getElementById("gameField");
    laser.vert = document.getElementById("vertLaser");
    laser.horiz = document.getElementById("horLaser");
    player.obj = document.getElementById("player");
    txtCt = document.getElementById("countdown");

    $('.btnStart').click(StartGame);
    $('#btnFscr').click(ChangeFullScreen);
    $('#cbOrient').click(CBOrientClicked);

    if (window.mobilecheck()) {
        CBOrientClicked();
    }
    
}

function StartGame() {
    if (gameOver) {
        //ClearAllTimeOuts();
        if (window.mobilecheck()) {
            GoFullScreen();
        }
        if (useDevOr) {
            orientControl.Init();
        }
        if (document.getElementById("cbOrient").getAttribute("data-checked") == "true") {
            useDevOr = true;
        }
        else {
            useDevOr = false;
        }
        gameOver = false;
        pause = false;
        document.getElementById("welcomeScreen").style.visibility = "hidden";
        document.getElementById("gameOverScreen").style.visibility = "hidden";
        document.getElementById("gameField").style.visibility = "visible";

        ct = countdown;
        txtCt.textContent = ct;
        init();
        setTimeout(DoCountDown, 1000);

        if (debug) {
            DrawDebugInfo();
        }
    }
}

function init() {
    player.rad = parseFloat(player.obj.getAttribute("r"));

    player.SetX(Math.floor(Math.random() * (playground.width - 64)) + 32);
    player.SetY(Math.floor(Math.random() * (playground.width - 64)) + 32);

    player.obj.setAttribute("cx", player.xPos);
    player.obj.setAttribute("cy", player.yPos);

    player.speed.x = 0;
    player.speed.y = 0;

    score = 0;
    $('#score').html(score);

    var x;
    var y;
    while (((x = (Math.floor(Math.random() * (playground.width - 64)) + 32)) > player.xPos - 160) && (x < player.xPos + 160));
    while (((y = (Math.floor(Math.random() * (playground.width - 64)) + 32)) > player.yPos - 160) && (y < player.yPos + 160));
    laser.vert.setAttribute("x", x);
    laser.horiz.setAttribute("y", y);

	laser.width = laser.vert.getAttribute("width");
	
	if ((Math.random() - 0.5) > 0) {
	    laser.speed.x = laserStartSpeed;
	}
	else {

	    laser.speed.x = -laserStartSpeed;
	}
	if ((Math.random() - 0.5) > 0) {
	    laser.speed.y = laserStartSpeed;
	}
	else {

	    laser.speed.y = -laserStartSpeed;
	}

    frameCount = 0;
    if(mine!= null){
        DespawnMine();
    }
    if(clock!= null){
        DespawnClock();
    }
    if(star!= null){
        gameField.removeChild(star);
        star = null;
    }
    spawnStar();
}

function DoCountDown() {
    if (ct > 1) {
        ct--;
        txtCt.textContent = ct;
        setTimeout(DoCountDown, 1000);
    } else {
        txtCt.textContent = "";

        gameLoopInterval = setInterval(gameloop, 1000 / GAMESPEED);
        spawnMineTimer = new Timer(SpawnMine, mineSpawntime);
        spawnClockTimer = new Timer(SpawnClock, clockSpawntime);
    }
}

function gameloop() {
    var t1 = performance.now();
    fps = 1000 / (t1 - t0);
    t0 = t1;
    
    if (!pause && !gameOver) {
        player.Move();
        laser.Move();
        MoveMine();
        CrashDetection();
    }
    if (debug) {
        DrawDebugInfo();
    }
    if (gameOver) {
        GameOver();
    }
}

function PauseGame() {
    if (!gameOver) {
        pause = !pause;
        if (pause) {
            console.log(spawnClockTimer);
            spawnClockTimer.pause();
            spawnMineTimer.pause();
        }
        else {
            spawnClockTimer.resume();
            spawnMineTimer.resume();
        }
    }
}

function GameOver() {
    control.pause = false;
    //ClearAllTimeOuts();
    clearInterval(gameLoopInterval);
    if (spawnClockTimer != null) {
        spawnClockTimer.pause();
        spawnClockTimer = null;
    }
    if (spawnMineTimer != null) {
        spawnMineTimer.pause();
        spawnMineTimer = null;
    }
    gameLoopInterval = null;
    document.getElementById("gameOverScreen").style.visibility = "visible"
    document.getElementById("gameOverScore").textContent = "Sie haben "+score + " Punkte erzielt"
}

function spawnStar() {
    var x;
    var y;
    while (((x = (Math.floor(Math.random() * (playground.width - 64)) + 32)) > player.xPos - 80) && (x < player.xPos + 80));
    while (((y = (Math.floor(Math.random() * (playground.height - 64)) + 32)) > player.yPos - 80) && (y < player.yPos + 80));

    star = document.createElementNS("http://www.w3.org/2000/svg", "use");
    star.setAttribute("x", x);
    star.setAttribute("y", y);
    star.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#star");

    gameField.appendChild(star);
}

function SpawnMine() {
    if (mine != null) return;
    var x;
    var y;
    while (((x = (Math.floor(Math.random() * (playground.width - 64)) + 32)) > player.xPos - 160) && (x < player.xPos + 160));
    while (((y = (Math.floor(Math.random() * (playground.height - 64)) + 32)) > player.yPos - 160) && (y < player.yPos + 160));

    mine = document.createElementNS("http://www.w3.org/2000/svg", "use");
    mine.setAttribute("x", x);
    mine.setAttribute("y", y);
    mine.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#mine");

    gameField.appendChild(mine);

    if (spawnMineTimer != null) {
        spawnMineTimer.pause;
        spawnMineTimer = null;
    }
    spawnMineTimer = new Timer(DespawnMine, mineDespawntime);
}

function DespawnMine() {
    if (mine != null) {
        gameField.removeChild(mine);
        mine = null;
    }
    if (spawnMineTimer != null) {
        spawnMineTimer.pause;
        spawnMineTimer = null;
    }
    spawnMineTimer = new Timer(SpawnMine, mineSpawntime);
}

function SpawnClock() {
    if (clock != null) return;
    var x;
    var y;
    while (((x = (Math.floor(Math.random() * (playground.width-64))+32)) > player.xPos - 160) && (x < player.xPos + 160));
    while (((y = (Math.floor(Math.random() * (playground.height-64))+32)) > player.yPos - 160) && (y < player.yPos + 160));

    clock = document.createElementNS("http://www.w3.org/2000/svg", "use");
    clock.setAttribute("x", x);
    clock.setAttribute("y", y);
    clock.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#clock");

    gameField.appendChild(clock);

    if (spawnClockTimer != null) {
        spawnClockTimer.pause();
        spawnClockTimer = null;
    }
    spawnClockTimer = new Timer(DespawnClock, clockDespawntime);
}

function DespawnClock() {
    if (clock != null) {
        gameField.removeChild(clock);
        clock = null;
    }
    if (spawnClockTimer != null) {
        spawnClockTimer.pause();
        spawnClockTimer = null;
    }
    spawnClockTimer = new Timer(SpawnClock, clockSpawntime);
}

//Prüft auf Kollisionen mit allen Objekten
function CrashDetection() {
    //Hit Laser?
    var x = parseFloat(laser.vert.getAttribute("x"));
    var y = parseFloat(laser.horiz.getAttribute("y"));
    if( player.GotHit(x - laser.width / 2, 0, x + laser.width / 2, 640) ||
        player.GotHit(0, y - laser.width / 2, 640, y + laser.width / 2)) {
        gameOver = true;
    }

    //Hit Star?
    var starbb = GetBBox(star);
    if (player.GotHit(starbb.x, starbb.y, starbb.x + starbb.width, starbb.y + starbb.height)) {
        //console.log("hit star");
        score += 10;
        $('#score').html(score);
        gameField.removeChild(star);
        spawnStar();
    }

    //Hit Mine?
    if (mine != null) {
        var mineBB = GetBBox(mine);
        if (player.GotHit(mineBB.x, mineBB.y, mineBB.x + mineBB.width, mineBB.y + mineBB.height)) {
            //console.log("hit mine");
            DespawnMine();
            laser.speed.x *= minePenalty;
            laser.speed.y *= minePenalty;
        }
    }
    
    //Hit Clock?
    if (clock != null) {
        var clockBB = GetBBox(clock);
        if (player.GotHit(clockBB.x, clockBB.y, clockBB.x + clockBB.width, clockBB.y + clockBB.height)) {
            //console.log("hit clock");
            DespawnClock();
            laser.speed.x *= clockBonus;
            laser.speed.y *= clockBonus;
        }
    }
}

//Bewegt die Mine
function MoveMine() {
    if (mine == null) return;
    var xSpeed;
    var ySpeed;
    var mineBB = GetBBox(mine);
    var x = parseFloat(mine.getAttribute("x"));
    var y = parseFloat(mine.getAttribute("y"));

    var xDiff = player.xPos - x - mineBB.width / 2;
    var yDiff = player.yPos - y - mineBB.height / 2;

    var ratio = GetSpeedRatio(xDiff,yDiff, minespeed);
    xSpeed = xDiff * ratio;
    ySpeed = yDiff * ratio;

    mine.setAttribute("x", x + xSpeed);
    mine.setAttribute("y", y + ySpeed);
}

//Berechnet die Überschneidung zweiere Eindimensionaler Linien 
function IntersectionLineWidth(sp1, ep1, sp2, ep2) {
    var res;
    if (sp1 < sp2) {
        return ep1 - sp2;
    } else {
        return ep2 - sp1;
    }
}

//Hilfsunktion um die diagonale Geschwindigkeit zu beschränken
function GetSpeedRatio(a, b, max) {
    var x;
    x = Math.sqrt(Math.pow(max, 2) / (Math.pow(a, 2) + Math.pow(b, 2)));
    return x;
}

//Bounding Box manuell berechnen weil Edge s*** ist..
function GetBBox(e) {
    var ebb = e.getBBox();
    var res = {
        x: parseFloat(e.getAttribute("x")),
        y: parseFloat(e.getAttribute("y")),
        width: parseFloat(ebb.width),
        height: parseFloat(ebb.height)
    }
    return res;
}

function ClearAllTimeOuts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0 ; i < highestTimeoutId ; i++) {
        clearTimeout(i);
    }
}

function ChangeFullScreen() {
    if (!fullscreen) {
        GoFullScreen();
    }
    else {
        ExitFullScreen();
    }
}

function GoFullScreen() {
    // go full-screen
    if (svg_playground.requestFullscreen) {
        svg_playground.requestFullscreen();
    } else if (svg_playground.webkitRequestFullscreen) {
        svg_playground.webkitRequestFullscreen();
    } else if (svg_playground.mozRequestFullScreen) {
        svg_playground.mozRequestFullScreen();
    } else if (i.msRequestFullscreen) {
        svg_playground.msRequestFullscreen();
    }
}

function ExitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function FullScreenChanged() {
    fullscreen = !fullscreen;
}

function CBOrientClicked() {
    var cross = document.getElementById("cbOrientChecked");
    var cb = document.getElementById("cbOrient");
    if (cb.getAttribute("data-checked") == "true") {
        cb.setAttribute("data-checked", "false");
        cross.setAttribute("xlink:href", "");
    }
    else {
        cb.setAttribute("data-checked", "true");
        cross.setAttribute("xlink:href", "img/cross.png");
    }
}

//Benutzt regexpt um herauszufinden ob das Gerät mobil ist.
//SRC: detectmobilebrowsers.com
window.mobilecheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

//Gibt ein paar nützliche Daten zum Debuggen aus
function DrawDebugInfo() {
    var text = document.getElementById("debug");

    text.innerHTML = "xSpeed: " + Math.round(player.speed.x*100)/100 + "<br>";
    text.innerHTML += "ySpeed: " + Math.round(player.speed.y * 100) / 100 + "<br>";
    text.innerHTML += "actSpeed: " + Math.round(player.speed.act * 100) / 100 + "<br>";
    text.innerHTML += "xPos: " + Math.round(player.xPos*100)/100 + "<br>";
    text.innerHTML += "yPos: " + Math.round(player.yPos*100)/100 + "<br>";
    text.innerHTML += "laser speed x: " + Math.round(laser.speed.x * 100) / 100 + " <br>";
    text.innerHTML += "laser speed y: " + Math.round(laser.speed.y * 100) / 100 + " <br>";
    text.innerHTML += "control up: " + control.up + " <br>";
    text.innerHTML += "control down: " + control.down + " <br>";
    text.innerHTML += "control left: " + control.left + " <br>";
    text.innerHTML += "control right: " + control.right + " <br>";
    text.innerHTML += "gp up: " + gpCtr.up + " <br>";
    text.innerHTML += "gp down: " + gpCtr.down + " <br>";
    text.innerHTML += "gp left: " + gpCtr.left + " <br>";
    text.innerHTML += "gp right: " + gpCtr.right + " <br>";
    text.innerHTML += "gp x: " + gpCtr.x + " <br>";
    text.innerHTML += "gp y: " + gpCtr.y + " <br>";
    text.innerHTML += "DevOr enabled: " + useDevOr + " <br>";
    text.innerHTML += "Orient absolute: " + orientControl.absolute + " <br>";
    text.innerHTML += "Orient alpha: " + orientControl.alpha + " <br>";
    text.innerHTML += "Orient beta: " + orientControl.beta + " <br>";
    text.innerHTML += "Orient gamma: " + orientControl.gamma + " <br>";
    text.innerHTML += "fps: " + Math.round(fps*100)/100 + " <br>";
    text.innerHTML += "score: " + score;
}


