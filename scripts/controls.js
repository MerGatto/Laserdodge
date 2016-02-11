var KEY_UP = 38;
var KEY_W = 87;
var KEY_DOWN = 40;
var KEY_S = 83;
var KEY_LEFT = 37;
var KEY_A = 65;
var KEY_RIGHT = 39;
var KEY_D = 68;
var KEY_PAUSE = 32;
var KEY_ENTER = 13;

var control = {
    up: false,
    down: false,
    left: false,
    right: false,
}

var gpCtr = {
    x: 0,
    y: 0,
    up: false,
    down: false,
    left: false,
    right: false
}

var oldState = {
    b0: false,
    b1: false
}

var orientControl = {
    absolute: 0,
    alpha: 0,
    beta: 0,
    gamma: 0,
    startGamma: 0,
    startBeta: 0,
    up: false,
    down: false,
    left: false,
    right: false,
    Init: function() {
        this.startGamma = this.gamma;
        this.startBeta = this.beta;
    }
}

var hasGP = false;
var repGP;


$(document).ready(function () {
    window.onkeydown = KeyDown;
    window.onkeyup = KeyUp;
    window.addEventListener("deviceorientation", handleOrientation, true);


    if (canGame()) {
        $(window).on("gamepadconnected", function () {
            hasGP = true;
            console.log("connection event");
            repGP = window.setInterval(reportOnGamepad, 100);
        });

        $(window).on("gamepaddisconnected", function () {
            console.log("disconnection event");
            window.clearInterval(repGP);
        });

        var checkGP = window.setInterval(function () {
            if (navigator.getGamepads()[0]) {
                if (!hasGP) $(window).trigger("gamepadconnected");
                window.clearInterval(checkGP);
            }
        }, 500);
    }
});


function canGame() {
    return "getGamepads" in navigator;
}

function handleOrientation(event) {
    orientControl.absolute = event.absolute;
    orientControl.alpha = event.alpha;
    orientControl.beta = event.beta;
    orientControl.gamma = event.gamma;

    if (useDevOr) {
        if (window.innerWidth > window.innerHeight) {
            if (orientControl.beta > orTolerance) {
                orientControl.right = true;
                control.right = true;
            } else if (orientControl.right) {
                orientControl.right = false;
                control.right = false;
            }

            if (orientControl.beta < -orTolerance) {
                orientControl.left = true;
                control.left = true;
            } else if (orientControl.left) {
                orientControl.left = false;
                control.left = false;
            }

            if ((orientControl.gamma - orientControl.startGamma) < -orTolerance) {
                orientControl.down = true;
                control.down = true;
            } else if (orientControl.down) {
                orientControl.down = false;
                control.down = false;
            }

            if ((orientControl.gamma - orientControl.startGamma) > orTolerance) {
                orientControl.up = true;
                control.up = true;
            } else if (orientControl.up) {
                orientControl.up = false;
                control.up = false;
            }
        }
        else {
            if ((orientControl.beta - orientControl.startBeta) > orTolerance) {
                orientControl.down = true;
                control.down = true;
            } else if (orientControl.down) {
                orientControl.down = false;
                control.down = false;
            }

            if ((orientControl.beta - orientControl.startBeta) < -orTolerance) {
                orientControl.up = true;
                control.up = true;
            } else if (orientControl.up) {
                orientControl.up = false;
                control.up = false;
            }

            if (orientControl.gamma > orTolerance) {
                orientControl.right = true;
                control.right = true;
            } else if (orientControl.right) {
                orientControl.right = false;
                control.right = false;
            }

            if (orientControl.gamma < -orTolerance) {
                orientControl.left = true;
                control.left = true;
            } else if (orientControl.left) {
                orientControl.left = false;
                control.left = false;
            }
        }
    }
}

function reportOnGamepad() {
    if (useGP) {
        var gp = navigator.getGamepads()[0];

        gpCtr.x = Math.abs(gp.axes[0]);
        gpCtr.y = Math.abs(gp.axes[1]);

        if (gp.axes[0] > gpTolerance) {
            gpCtr.right = true;
            control.right = true;
        }else if(gpCtr.right){
            gpCtr.right = false;
            control.right = false;
        }

        if (gp.axes[0] < -gpTolerance) {
            gpCtr.left = true;
            control.left = true;
        }else if(gpCtr.left){
            gpCtr.left = false;
            control.left = false;
        }

        if (gp.axes[1] > gpTolerance) {
            gpCtr.down = true;
            control.down = true;
        } else if (gpCtr.down) {
            gpCtr.down = false;
            control.down = false;
        }

        if (gp.axes[1] < -gpTolerance) {
            gpCtr.up = true;
            control.up = true;
        } else if (gpCtr.up) {
            gpCtr.up = false;
            control.up = false;
        }
        if (gp.buttons[0].pressed && !oldState.b0) {
            StartGame();
        }
        if (gp.buttons[1].pressed && !oldState.b1) {
            PauseGame();
        }
        oldState.b0 = gp.buttons[0].pressed;
        oldState.b1 = gp.buttons[1].pressed;
    }
}


function KeyDown(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    switch (key) {
        case KEY_PAUSE:
            PauseGame();
            break;
        case KEY_UP:
            control.up = true;
            break;
        case KEY_W:
            control.up = true;
            break;
        case KEY_DOWN:
            control.down = true;
            break;
        case KEY_S:
            control.down = true;
            break;
        case KEY_LEFT:
            control.left = true;
            break;
        case KEY_A:
            control.left = true;
            break;
        case KEY_RIGHT:
            control.right = true;
            break;
        case KEY_D:
            control.right = true;
            break;
        case KEY_ENTER:
            StartGame();
            break;
    }
}

function KeyUp(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    switch (key) {
        case KEY_UP:
            control.up = false;
            break;
        case KEY_W:
            control.up = false;
            break;
        case KEY_DOWN:
            control.down = false;
            break;
        case KEY_S:
            control.down = false;
            break;
        case KEY_LEFT:
            control.left = false;
            break;
        case KEY_A:
            control.left = false;
            break;
        case KEY_RIGHT:
            control.right = false;
            break;
        case KEY_D:
            control.right = false;
            break;
    }
}
