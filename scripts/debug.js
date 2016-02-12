var debug = false;

function ActivateDebugging() {
    debug = true;
    setInterval(DrawDebugInfo, 100);
    DrawDebugInfo();
}

//Gibt ein paar nützliche Daten zum Debuggen aus
function DrawDebugInfo() {
    var text = document.getElementById("debug");

    text.innerHTML = "xSpeed: " + Math.round(player.speed.x * 100) / 100 + "<br>";
    text.innerHTML += "ySpeed: " + Math.round(player.speed.y * 100) / 100 + "<br>";
    text.innerHTML += "actSpeed: " + Math.round(player.speed.act * 100) / 100 + "<br>";
    text.innerHTML += "xPos: " + Math.round(player.xPos * 100) / 100 + "<br>";
    text.innerHTML += "yPos: " + Math.round(player.yPos * 100) / 100 + "<br>";
    text.innerHTML += "laser speed x: " + Math.round(laser.speed.x * 100) / 100 + " <br>";
    text.innerHTML += "laser speed y: " + Math.round(laser.speed.y * 100) / 100 + " <br>";
    if (spawnMineTimer == null) {
        text.innerHTML += "spawnMineTimer: " + "null" + " <br>";
    } else {
        text.innerHTML += "spawnMineTimer: " + spawnMineTimer.timerId + " <br>";
    }
    if (spawnClockTimer == null) {
        text.innerHTML += "spawnClockTimer: " + "null" + " <br>";
    } else {
        text.innerHTML += "spawnClockTimer: " + spawnClockTimer.timerId + " <br>";
    }
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
    text.innerHTML += "fps: " + Math.round(fps * 100) / 100 + " <br>";
    text.innerHTML += "score: " + score;
}