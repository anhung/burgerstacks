window.onload = init;
document.onkeypress = keyHit;
document.onkeyup = keyHit;

// game components
var player;
var ingredients;
var gameEnded;
var column0;
var column1;
var column2;
var column3;
var spawns;

// ui components
var ui_playerRow;
var ui_column0;
var ui_column1;
var ui_column2;
var ui_column3;
var ui_spawnRow;

function init() {
    // init game
    player = 0;
    gameEnded = false;
    spawns = new Array(4);
    ingredients = ["Top bun", "Cheese", "Lettuce",
        "Onion", "Tomato", "Patty", "Bottom bun"];
        
    // init ui
    ui_column0 = new Array(9);
    ui_column1 = new Array(9);
    ui_column2 = new Array(9);
    ui_column3 = new Array(9);
    ui_spawnRow = new Array(4);
    ui_playerRow = new Array(4);
    
    function initSection(section, offset, cellType) {
        var idName;
        for (var i = 0; i < section.length; i++) {
            idName = cellType + (offset + i);
            section[i] = document.getElementById(idName);
        }
    }      
    
    initSection(ui_column0, 0, "grid");
    initSection(ui_column1, 9, "grid");
    initSection(ui_column2, 18, "grid");
    initSection(ui_column3, 27, "grid");
    initSection(ui_spawnRow, 0, "spawn");
    initSection(ui_playerRow, 0, "player");
    ui_playerRow[player].className = "playerSelected";
    ui_playerRow[player+1].className = "playerSelected";
    generateRandomIngredients();
    updateUI();
}

function updateUI() {
    // spawn row: generate random ingredients
    for (var i = 0; i < ui_spawnRow.length; i++) {
        ui_spawnRow[i].innerHTML = spawns[i];
    }
    
    // columns: update any swaps
    
    
    // player row: update selected columns
    for (var i = 0; i < ui_playerRow.length; i++) {
        if (i === player || i === player+1) {
            ui_playerRow[i].className = "playerSelected";
        }
        else {
            ui_playerRow[i].className = "";
        }
    }
}

function gameOver() {
    
}

function keyHit(evt) {
    if (!gameEnded) {
        var thisKey;
        var key_left = 37;
        var key_right = 39;
        var key_a = 97;
        var key_s = 115;
        
        if (evt) {
            thisKey = evt.charCode | evt.which;
        }
        else {
            thisKey = window.event.keyCode;
        }
        
        if (thisKey === key_a) {
            //swapColumns();
            generateRandomIngredients();
        }
        else if (thisKey === key_s) {
            //dropIngredients();s
            generateRandomIngredients();
        }
        else if (thisKey === key_left) {
            updatePlayerSelection("left");
        }
        else if (thisKey === key_right) {
            updatePlayerSelection("right");
        }
        
        updateUI();
    }
}

function updatePlayerSelection(direction) {
    if (!gameEnded) {
        if (direction === "left" && player > 0) {
            player = player - 1;
        }
        else if (direction === "right" && player < 2) {
            player = player + 1;
        }
    }
}

function dropIngredients() {
    if (!gameEnded && allColumnsSafe()) {
    
    }
    else {
        gameEnded = true;
    }
}

function checkForMatch() {
    

}

function swapColumns() {
    if (!gameEnded) {
    
    }
}   

function allColumnsSafe() {
    return true;
}

function generateRandomIngredients() {
    for (var i = 0; i < spawns.length; i++) {
        spawns[i] = ingredients[Math.ceil(Math.random() * 6)];
    }
}