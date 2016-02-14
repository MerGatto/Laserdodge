//Gamespeed in FPS
var GAMESPEED = 125;

//Benutze Schwenksteuerung(noch nicht verfügbar)
var useDevOr = false;

//Orientation Schwenktoleranz
var orTolerance = 5;

//Benutzes ein Gamepad(wenn verfügbar)
var useGP = true;
//Gamepad StickToleranz
var gpTolerance = 0.3;

//Countdown bis zum Start(sek)
var countdown = 3;

//Spawntimer für die Uhr(ms)
var clockSpawntime = 6000;
var clockDespawntime = 4000;

//Verlangsamung des Lasers durch die Uhr
var clockBonus = 0.8;

//Spawntimer für die Mine(ms)
var mineSpawntime = 5000;
var mineDespawntime = 1750;

//Geschwindigkeit der Mine(px/frame)
var minespeed = 2.5;

//Geschwindigkeitserhöhung des Lasers durch die Mine
var minePenalty = 1.3;

//Maximale Spielergeschwindigkeit(px/frame)
var playerMaxSpeed = 4.5;
//Spielerbeschleunigung(px/frame)
var playerAcc = 0.06;
//Spielerbremswirkung(px/frame)
var playerBrk = 0.05;

//Startgeschwindigkeit des Lasers
var laserStartSpeed = 1;

//Min und Maximale Veränderung des Lasers beim Aufprall an der Wand
//Angaben in Prozent
var minLaserChange = -5;
var maxLaserChange = 15;