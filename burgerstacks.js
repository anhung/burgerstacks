/**
 * Burger Stacks is a puzzle game. Eliminate ingredients by swapping rows and
 * dropping ingredients to create matches.
 *
 * Future features:
 * Burgers: Build burgers by surrounding items with a Top bun and a Bottom
 * bun to eliminate multiple ingredients at once! Gives bonus points!
 * Nomming: Use the power ups by capturing them inside burgers. Ideas: remove
 * all of one ingredient, clear one column, or remove top from each column.
 *
 * @author Annabel Hung <annabel.hung@gmail.com>
 */

window.onload = init;
document.onkeypress = keyHit;
document.onkeyup = keyHit;

// game components
var player;         // Number, the left index of the player's selected columns
var ingredients;    // Array, the ingredients
var gameEnded;      // Boolean, true if game over
var column0;        // Array, the ingredients in the first column
var column1;        // Array, the ingredients in the second column
var column2;        // Array, the ingredients in the third column
var column3;        // Array, the ingredients in the fourth column
var spawns;         // Array, the ingredients in the spawn row
var points;         // Number, score counter

// ui components
var ui_playerRow;   // Array, cells corresponding to the player row
var ui_column0;     // Array, left-most column of cells
var ui_column1;     // Array, middle-left column of cells
var ui_column2;     // Array, middle-right column of cells
var ui_column3;     // Array, right-most column of cells
var ui_spawnRow;    // Array, cells corresponding to the spawn row
var ui_message;     // HTML element to display messages to player
var ui_score;       // HTML element to display score counter
var img_ingredients;// Array, src of ingredient images
var pic;

/**
 * Initializes all of game and UI components. Gets the game ready to play!
 * This function is also used to reset the components when starting a 
 * new game.
 */
function init() {
    // init game
    points = 0;
    player = 0;
    gameEnded = false;
    spawns = new Array(4);
    ingredients = ["Top bun", "Cheese", "Lettuce",
        "Onion", "Tomato", "Patty", "Bottom bun"];
    img_ingredients = ["topbun.png", "cheese.png", "lettuce.png",
        "onion.png", "tomato.png", "patty.png", "bottombun.png"];
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

    /**
     * Helper function to link variables to HTML elements.
     * @param {Array} section The section of the game grid: spawn row, columns,
     *     or player row
     * @param {Number} offset A value to assist in linking HTML elements.
     * @param {String} cellType The type of the cells in this section: spawn,
     *     player, or grid.
     */
    function initSection(section, offset, cellType) {
        var idName;
        for (var i = 0; i < section.length; i++) {
            idName = cellType + (offset + i);
            section[i] = document.getElementById(idName);
        }
    }

    /**
     * Helper function to fill in initial column values with blanks.
     * @param {Array} column The column to fill in.
     */
    function fillColumn(column) {
        for (var i = 0; i < column.length; i++) {
            column[i] = " ";
        }
    }
    
    // Set up messages underneath the game grid.
    ui_message = document.getElementById("message");
    ui_message.innerHTML = "Burgers suck."
    ui_score = document.getElementById("score");
    
    // Initialize the sections of the game grid.
    initSection(ui_column0, 0, "grid");
    initSection(ui_column1, 9, "grid");
    initSection(ui_column2, 18, "grid");
    initSection(ui_column3, 27, "grid");
    initSection(ui_spawnRow, 0, "spawn");
    initSection(ui_playerRow, 0, "player");
    
    // Adjustments
    ui_column0.reverse();
    ui_column1.reverse();
    ui_column2.reverse();
    ui_column3.reverse();
    
    // Set up the player row; second and third columns selected by default.
    ui_playerRow[player].className = "playerSelected";
    ui_playerRow[player+1].className = "playerSelected";
    
    // Clear the game over messages if set.
    for (var i = 0; i < ui_playerRow.length; i++) {
        ui_playerRow[i].innerHTML = "";
    }    
    
    // Generate the first spawns.
    generateRandomIngredients();
    
    // Display all of these initializations.
    updateUI();
}

/**
 * Updates all of the HTML elements to reflect changes that were made after
 * each key press. 
 */
function updateUI() {
    /**
     * Updates the column to display the correct values. Accounts for swaps.
     * @param {Array} ui_column The HTML element to update.
     * @param {Array} column The game column values to use.
     */
    function updateColumn(ui_column, column) {
        // Display this column's items.
        for (var i = 0; i < column.length; i++) {
            if (i < 9) {
                ui_column[i].innerHTML = "<img src=\"images/" + column[i] + "\">";
            }
        }
        // Clean up the rest of the column.
        for (var i = column.length; i < ui_column.length; i++) {
            ui_column[i].innerHTML = " ";
        }
    }

    // Generate new random ingredients.
    for (var i = 0; i < ui_spawnRow.length; i++) {
        ui_spawnRow[i].innerHTML = "<img src=\"images/" + spawns[i] + "\">";
    }
    
    // Update the columns.
    updateColumn(ui_column0, column0);
    updateColumn(ui_column1, column1);
    updateColumn(ui_column2, column2);
    updateColumn(ui_column3, column3);
    
    // Update the player row to reflect changes.
    for (var i = 0; i < ui_playerRow.length; i++) {
        if (i === player || i === player+1) {
            ui_playerRow[i].className = "playerSelected";
        }
        else {
            ui_playerRow[i].className = "";
        }
    }
    
    // Update score counter.
    ui_score.innerHTML = "Score: " + points;
}

/**
 * Key event handler. Here are the game's controls:
 *
 * Left arrow: move player selector to the left.
 * Right arrow: move player selector to the right.
 * a button: Swap the two selected columns.
 * s button: Drop the spawns.
 * b button: Reset the game (usable only at game over)
 * Calls the corresponding helper functions to carry out the player's action.
 *
 * @param evt The keyboard event to deal with.
 */
function keyHit(evt) {
    var thisKey;            // the key that triggered this event
    var key_left = 37;      // charCode for left arrow
    var key_right = 39;     // charCode for right arrow
    var key_a = 97;         // charCode for 'a' key
    var key_b = 98;         // charCode for 'b' key
    var key_s = 115;        // charCode for 's' key
    
    /**
     * Changes the player's column selection based on the direction key
     * that was pressed.
     *
     * @param {String} direction Either left or right.
     */
    function updatePlayerSelection(direction) {
        if (direction === "left" && player > 0) {
            player = player - 1;
        }
        else if (direction === "right" && player < 2) {
            player = player + 1;
        }
    }
    
    // Get the key.
    if (evt) {
        thisKey = evt.charCode | evt.which;
    }
    else {
        thisKey = window.event.keyCode;
    }

    // Deal with the key.
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
        
        // Always update to show changes.
        updateUI();
    }
    else {
        // Reset the game.
        if (thisKey === key_b) {
            gameEnded = false;
            points = 0;
            init();
        }
    }
}

/**
 * Drops the spawned items onto the columns. Also checks for any matches, 
 * incrementing the score counter by 1 for each found.
 */
function dropIngredients() {
    /**
     * Future feature: build burgers to eliminate multiple ingredients at once.
     *
     * @param {String} spawn The specified spawn item.
     * @param (Array} column The column to check.
     * @returns {Boolean} true if a burger can be made, otherwise false.
     */
    function checkForBurger(spawn, column) {
        // coming soon
    }

    /**
     * Checks if the specified spawn item matches the item on top of the
     * specified column. Also checks a full column: if dropping an item
     * doesn't save the player, then this function triggers game over.
     *
     * @param {String} spawn The specified spawn item.
     * @param {Array} column The column to check.
     * @returns {Boolean} true if a match exists, otherwise false.
     */
    function checkForMatch(spawn, column) {
        var last = column.length - 1;        
        var matched = (last > -1) && (spawn === column[last]);
        
        // Is it gonna be game over?
        if (column.length === 9 && !matched) {
            gameEnded = true;
            gameOver();
        }
        
        return matched;
    }

    /**
     * Performs the actual drop. If there is a match, pop the top element out
     * of the column and increment the score counter. Otherwise, push the 
     * spawn item onto the column.
     *
     * @param {String} spawn The specified spawn item.
     * @param {Array} column The column to check.
     */
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
    
    // Drop them spawns!
    if (!gameEnded && allColumnsSafe()) {
        doDrop(spawns[0], column0);
        doDrop(spawns[1], column1);
        doDrop(spawns[2], column2);
        doDrop(spawns[3], column3);
    }
}

/**
 * Swaps the items in the two columns currently selected by the player.
 */
function swapColumns() {
    if (!gameEnded) {
        var col1;                   // first column
        var col2;                   // second column
        var swap = new Array();     // temporary array
        
        /**
         * Pops all of the items out of the array. Is there really no built-in
         * function to do this?
         *
         * @param {Array} a The array to clear.
         */
        function clearArray(a) {
            for (var i = 0; i < a.length; i++) {
                a.pop();
            }
        }
        
        /**
         * Performs the actual copying of elements from one array to another.
         *
         * @param {Array} src The source array.
         * @param {Array} dest The destination array.
         */
        function copyArray(src, dest) {
            // Clear the destination array. Has garbage.
            clearArray(dest);
                        
            // Copy from source array.
            for (var i = 0; i < src.length; i++) {
                dest[i] = src[i];
            }
            
            // Clear the source array. Has garbage now.
            clearArray(src);
        }        
        
        // Determine which columns are selected.
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
               
        // Do the swap.
        copyArray(col1, swap);
        copyArray(col2, col1)
        copyArray(swap, col2);
    }
}   

/**
 * Helper function. Checks if the columns have enough space to allow the 
 * spawns to drop.
 *
 * @returns {Boolean} true if it's safe to drop the spawns, false otherwise
 */
function allColumnsSafe() {
    return (column0.length < 10) && (column1.length < 10) &&
        (column2.length < 10) && (column3.length < 10);
}

/**
 * Fills the spawn array with new random elements.
 */
function generateRandomIngredients() {
    for (var i = 0; i < spawns.length; i++) {
        spawns[i] = img_ingredients[Math.ceil(Math.random() * 7) - 1];
    }
}

/**
 * Displays the game over message in the player row cells. Also displays a 
 * message to let the player know how to start a new game.
 */
function gameOver() {
    ui_playerRow[0].innerHTML = "G A M E";
    ui_playerRow[1].innerHTML = "O V E R";
    ui_playerRow[2].innerHTML = "G A M E";
    ui_playerRow[3].innerHTML = "O V E R";
    ui_message.innerHTML = "Press 'b' to play again!";
}