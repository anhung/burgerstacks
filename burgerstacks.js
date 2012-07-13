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
var points;

// ui components
var ui_playerRow;
var ui_column0;
var ui_column1;
var ui_column2;
var ui_column3;
var ui_spawnRow;
var ui_message;
var ui_score;

function init() {
    // init game
    points = 0;
    player = 0;
    gameEnded = false;
    spawns = new Array(4);
    ingredients = ["Top bun", "Cheese", "Lettuce",
        "Onion", "Tomato", "Patty", "Bottom bun"];
    column0 = new Array();
    column1 = new Array();
    column2 = new Array();
    column3 = new Array();
        
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

    function fillColumn(column) {
        for (var i = 0; i < column.length; i++) {
            column[i] = " ";
        }
    }
    
    ui_message = document.getElementById("message");
    ui_message.innerHTML = "Burgers suck."
    ui_score = document.getElementById("score");
    
    initSection(ui_column0, 0, "grid");
    initSection(ui_column1, 9, "grid");
    initSection(ui_column2, 18, "grid");
    initSection(ui_column3, 27, "grid");
    initSection(ui_spawnRow, 0, "spawn");
    initSection(ui_playerRow, 0, "player");
    ui_column0.reverse();
    ui_column1.reverse();
    ui_column2.reverse();
    ui_column3.reverse();
    ui_playerRow[player].className = "playerSelected";
    ui_playerRow[player+1].className = "playerSelected";
    for (var i = 0; i < ui_playerRow.length; i++) {
        ui_playerRow[i].innerHTML = "";
    }    
    generateRandomIngredients();
    updateUI();
}

function updateUI() {
    function updateColumn(ui_column, column) {
        // display this column's items
        for (var i = 0; i < column.length; i++) {
            if (i < 9) {
                ui_column[i].innerHTML = column[i];
            }
        }
        // clean up the rest of the column
        for (var i = column.length; i < ui_column.length; i++) {
            ui_column[i].innerHTML = " ";
        }
    }

    // spawn row: generate random ingredients
    for (var i = 0; i < ui_spawnRow.length; i++) {
        ui_spawnRow[i].innerHTML = spawns[i];
    }
    
    // columns: update any swaps  
    updateColumn(ui_column0, column0);
    updateColumn(ui_column1, column1);
    updateColumn(ui_column2, column2);
    updateColumn(ui_column3, column3);
    
    // player row: update selected columns
    for (var i = 0; i < ui_playerRow.length; i++) {
        if (i === player || i === player+1) {
            ui_playerRow[i].className = "playerSelected";
        }
        else {
            ui_playerRow[i].className = "";
        }
    }
    
    // update score?
    ui_score.innerHTML = "Score: " + points;
}

function gameOver() {
    //display game over message
    ui_playerRow[0].innerHTML = "G A M E";
    ui_playerRow[1].innerHTML = "O V E R";
    ui_playerRow[2].innerHTML = "G A M E";
    ui_playerRow[3].innerHTML = "O V E R";
    
    ui_message.innerHTML = "Press 'b' to play again!";
}

function keyHit(evt) {
    var thisKey;
    var key_left = 37;
    var key_right = 39;
    var key_a = 97;
    var key_b = 98;
    var key_s = 115;
    
    function updatePlayerSelection(direction) {
        if (direction === "left" && player > 0) {
            player = player - 1;
        }
        else if (direction === "right" && player < 2) {
            player = player + 1;
        }
    }
    if (evt) {
        thisKey = evt.charCode | evt.which;
    }
    else {
        thisKey = window.event.keyCode;
    }

    if (!gameEnded) {
        if (thisKey === key_a) {
            swapColumns();
        }
        else if (thisKey === key_s) {
            dropIngredients();
            if (allColumnsSafe()) {
                generateRandomIngredients();
            }
        }
        else if (thisKey === key_left) {
            updatePlayerSelection("left");
        }
        else if (thisKey === key_right) {
            updatePlayerSelection("right");
        }
        
        updateUI();
    }
    else {
        if (thisKey === key_b) {
            gameEnded = false;
            points = 0;
            init();
        }
    }
}

function dropIngredients() {
    function checkForMatch(spawn, column) {
        var last = column.length - 1;        
        var matched = (last > -1) && (spawn === column[last]);
        
        // is it gonna be game over?
        if (column.length === 9 && !matched) {
            gameEnded = true;
            gameOver();
        }
        
        return matched;
        
    }

    function doDrop(spawn, column) {
        if (checkForMatch(spawn, column)) {
            column.pop();
            points = points + 1;
        }
        else {
            if (!gameEnded) {
                column.push(spawn);
            }
        }
    }
    
    if (!gameEnded && allColumnsSafe()) {
        doDrop(spawns[0], column0);
        doDrop(spawns[1], column1);
        doDrop(spawns[2], column2);
        doDrop(spawns[3], column3);
    }
}

function swapColumns() {
    if (!gameEnded) {
        var col1;
        var col2;
        var swap = new Array();
        
        function clearArray(a) {
            for (var i = 0; i < a.length; i++) {
                a.pop();
            }
        }
        
        function copyArray(src, dest) {
            // clear the destination
            clearArray(dest);
                        
            // copy from source
            for (var i = 0; i < src.length; i++) {
                dest[i] = src[i];
            }
            
            // clear the source
            clearArray(src);
        }        
        
        // determine the two selected columns
        if (player === 0) {
            col1 = column0;
            col2 = column1;
        }
        else if (player === 1) {
            col1 = column1;
            col2 = column2;
        }
        else if (player === 2) {
            col1 = column2;
            col2 = column3;
        }
               
        // do the swap!
        copyArray(col1, swap);
        copyArray(col2, col1)
        copyArray(swap, col2);
    }
}   

function allColumnsSafe() {
    return (column0.length < 10) && (column1.length < 10) &&
        (column2.length < 10) && (column3.length < 10);
}

function generateRandomIngredients() {
    for (var i = 0; i < spawns.length; i++) {
        spawns[i] = ingredients[Math.ceil(Math.random() * 6)];
    }
}