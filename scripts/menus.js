var menus = new Map();

$(document).ready(function () {
    menus.set("main", document.getElementById("mainMenu"));
    menus.set("intro", document.getElementById("welcomeScreen"));
    menus.set("game", document.getElementById("gameField"));
    menus.set("gameOver", document.getElementById("gameOverScreen")); 
    menus.set("options", document.getElementById("optionsMenu"));


    $('#btnIntro').click(function () { ActivateMenu("intro"); }); 
    $('.btnBack').click(function () { ActivateMenu("main"); }); 
    $('#btnOptions').click(function () { ActivateMenu("options"); });

});

function ActivateMenu(key) {
    menus.forEach(function (value, key, mapObj) {
        value.setAttribute("visibility", "hidden");
    });
    menus.get(key).setAttribute("visibility", "visible");
}


