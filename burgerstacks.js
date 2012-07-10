window.onload = init;
document.onkeypress = keyHit;
document.onkeyup = keyHit;

var player;     // int representing the left of the player columns
var column0;    // array; left-most column's cells
var column0ptr;
var column1;    // array; middle left column's cells
var column1ptr;
var column2;    // array; middle right column's cells
var column2ptr;
var column3;    // array; right-most column's cells
var column3ptr;
var spawnRow;     // array; spawn row's cells
var playerRow;
var ingredients;
var gameEnded;

/*
    Set up function to initialize variables.
    Then calls the game loop function.
*/
function init() {
    gameEnded = false;
    player = 0;
    column0ptr = 8;
    column1ptr = 8;
    column2ptr = 8;
    column3ptr = 8;
    ingredients = new Array("Top bun", "Cheese", "Lettuce",
        "Onion", "Tomato", "Patty", "Bottom bun");
    column0 = new Array(9);
    column1 = new Array(9);
    column2 = new Array(9);
    column3 = new Array(9);
    spawnRow = new Array(4);
    playerRow = new Array(4);
    
    function initSection(section, offset, cellType) {
        var idName;
        for (var i = 0; i < section.length; i++) {
            idName = cellType + (offset + i);
            section[i] = document.getElementById(idName);
        }
    }      
    
    initSection(column0, 0, "grid");
    initSection(column1, 9, "grid");
    initSection(column2, 18, "grid");
    initSection(column3, 27, "grid");
    initSection(spawnRow, 0, "spawn");
    initSection(playerRow, 0, "player");
    generateRandomIngredients();
    playerRow[player].className = "playerSelected";
    playerRow[player+1].className = "playerSelected";
}

/*
    Code for when the game is over.
    Reset grid and new game?
*/
function gameOver() {
    
}

/*
    Generate a random ingredient.
*/
function generateRandomIngredients() {
    if (!gameEnded) {
        var ingredient;
        for (var i = 0; i < spawnRow.length; i++) {
            ingredient = ingredients[Math.ceil(Math.random() * 6)];
            spawnRow[i].innerHTML = ingredient;
        }
    }
}

/*
    Handle keyboard events.
*/
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
            // swap columns
            swapColumns();
        }
        else if (thisKey === key_s) {
            dropIngredients();
            generateRandomIngredients();
        }
        else if (thisKey === key_left) {
            updatePlayerSelection("left");
        }
        else if (thisKey === key_right) {
            updatePlayerSelection("right");
        }
    }
    else {
        //clear board
        //init
    }
}

/*
    Update the player's column selections.
*/
function updatePlayerSelection(direction) {
    if (!gameEnded) {
        playerRow[player].className = "";
        playerRow[player+1].className = "";
        if (direction === "left" && player > 0) {
            player = player - 1;
        }
        else if (direction === "right" && player < 2) {
            player = player + 1;
        }
        playerRow[player].className = "playerSelected";
        playerRow[player+1].className = "playerSelected";
    }
}

function dropIngredients() {
    if (!gameEnded && allColumnsSafe()) {
        column0[column0ptr].innerHTML = spawnRow[0].innerHTML;
        column1[column1ptr].innerHTML = spawnRow[1].innerHTML;
        column2[column2ptr].innerHTML = spawnRow[2].innerHTML;
        column3[column3ptr].innerHTML = spawnRow[3].innerHTML;    
        column0ptr = column0ptr - 1;
        column1ptr = column1ptr - 1;
        column2ptr = column2ptr - 1;
        column3ptr = column3ptr - 1;
    }
    else {
        gameEnded = true;
    }
}

function checkForMatch() {
    

}

function swapColumns() {
    if (!gameEnded) {
        var swap = new String();
        var firstCol = new Array();
        var secondCol = new Array();
        if (player === 0) {
            firstCol = column0;
            secondCol = column1;
        }
        else if (player === 1) {
            firstCol = column1;
            secondCol = column2;
        }
        else if (player === 2) {
            firstCol = column2;
            secondCol = column3;
        }
        for (var i = firstCol.length-1; i > 0; i--) {
            swap = firstCol[i].innerHTML;
            firstCol[i].innerHTML = secondCol[i].innerHTML;
            secondCol[i].innerHTML = swap;
        }
    }
}   

function allColumnsSafe() {
    return (column0ptr >= 0) && (column1ptr >= 0) &&
        (column2ptr >= 0) && (column3ptr >= 0);
}


/*** BRAINSTORM SECTION 
Top bun     1
Cheese      2
Lettuce     3
Onion       4
Tomato      5
Patty       6
Bottom bun  7

Total Items: 7

Power ups:
Nibble: Remove top ingredient from selected row
Bite: Remove top ingredient from each column.
Nom Nom Nom: Clear a entire column
***/
