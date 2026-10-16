const game = document.getElementById('gamediv')

const sizebuttons = document.getElementById('sizebuttons');
const board = document.getElementById('board');

const decrease_size = document.createElement("div");decrease_size.appendChild(document.createTextNode("➖️"));
const size_display = document.createElement("div");size_display.appendChild(document.createTextNode("7x7"));
const increase_size = document.createElement("div");increase_size.appendChild(document.createTextNode("➕️"));

const show_solution_button = document.getElementById('solutionbutton');
show_solution_button.addEventListener("click", show_solution);

decrease_size.addEventListener("click", decrease_board_size)
increase_size.addEventListener("click", increase_board_size)

let board_side_length = 7;

function decrease_board_size() {
    board_side_length -= 1;
    update_board_size();
}

function increase_board_size() {
    board_side_length += 1;
    update_board_size();
}

let board_grid = [];
let logical_board_grid = [];

function update_board_size() {
    board_side_length = Math.max(board_side_length, 1);
    size_display.innerText = board_side_length + "x" + board_side_length;
    board.replaceChildren();
    board_grid = [];
    logical_board_grid = [];
    for (let y = 0; y < board_side_length; y++) {
        board_grid[y] = [];
        logical_board_grid[y] = [];
        let row = document.createElement("div");
        row.className = "lihas"; // Makes it flex!
        for (let x = 0; x < board_side_length; x++) {
            let grid_item = document.createElement("div");
            grid_item.addEventListener("click", board_clicked.bind([x, y]));
            grid_item.innerText = "⬛️";
            board_grid[y][x] = grid_item;
            logical_board_grid[y][x] = false;
            row.appendChild(grid_item);
        }
        board.appendChild(row);
    }
}

function board_clicked() {
    let x = this[0];
    let y = this[1];

    console.log("Board clicked at (", x, ", ", y, ")!");
    flip_tile(this, logical_board_grid);

    for (let y = 0; y < board_side_length; y++) {
        for (let x = 0; x < board_side_length; x++) {
            if (logical_board_grid[y][x] === true) {
                board_grid[y][x].innerText = "⬜️"
            } else {
                board_grid[y][x].innerText = "⬛️"
            }
        }
    }
}

function flip_tile(tile_pos, logical_board) {
    if (tile_pos[0] < 0 ||
        tile_pos[1] < 0 ||
        tile_pos[0] >= logical_board.length ||
        tile_pos[1] >= logical_board[tile_pos[0]].length
        ) {
            return;
        }
    logical_board[tile_pos[1]][tile_pos[0]] = !logical_board[tile_pos[1]][tile_pos[0]];
}

function flip_tiles(tile_pos, logical_board) {
    let x = tile_pos[0];
    let y = tile_pos[1];
    flip_tile([x, y], logical_board);
    flip_tile([x + 1, y], logical_board);
    flip_tile([x - 1, y], logical_board);
    flip_tile([x, y + 1], logical_board);
    flip_tile([x, y - 1], logical_board);
}

function show_solution() {
    console.log("Starting solve!");
    let lookup_table = get_lookup_table(board_side_length);
    let moves = [];
    for (let y = 0; y < board_side_length; y++) {
        moves[y] = [];
        for (let x = 0; x < board_side_length; x++) {
            moves[y][x] = false;
        }
    }
    let board_copy = [];
    for (let y = 0; y < board_side_length; y++) {
        board_copy[y] = [];
        for (let x = 0; x < board_side_length; x++) {
            board_copy[y][x] = logical_board_grid[y][x];
        }
    }
    chase_lights(board_copy, moves);
    let top_row = "";
    for (let x = 0; x < board_side_length; x++) {
        if (board_copy[0][x] === true) {
            top_row += "1";
        } else {
            top_row += "0";
        }
    }
    console.log("Top row: ", top_row);
    let flips = lookup_table[top_row];
    console.log("Flips: ", flips);
    for (let x = 0; x < board_side_length; x++) {
        if (flips[x] === true) {
            flip_tiles([x, board_side_length - 1], board_copy);
            moves[board_side_length - 1][x] = !moves[board_side_length - 1][x];
        }
    }
    chase_lights(board_copy, moves);
    for (let x = 0; x < board_side_length; x++) {
        for (let y = 0; y < board_side_length; y++) {
            if (moves[y][x] === true) {
                board_grid[y][x].innerText = "🟥️";
            }
        }
    }
    console.log("(done)");
}

let lookup_tables = [];

function get_lookup_table(side_length) {
    if (lookup_tables[side_length] == null) {
        lookup_tables[side_length] = make_lookup_table(side_length);
    }
    return lookup_tables[side_length];
}

function make_lookup_table(side_length) {
    console.log("Making a lookup table for side length ", side_length);
    let flips = [];
    for (let i = 0; i < side_length; i++) {
        flips[i] = false;
    }
    let lookup = {};
    let amount = 0;
    while (true) {
        let temp_board = [];
        for (let y = 0; y < side_length; y++) {
            temp_board[y] = [];
            for (let x = 0; x < side_length; x++) {
                temp_board[y][x] = false;
            }
        }
        for (let x = 0; x < side_length; x++) {
            if (flips[x] === true) {
                flip_tiles([x, side_length - 1], temp_board);
            }
        }
        chase_lights(temp_board);
        let result = "";
        for (let x = 0; x < side_length; x++) {
            let c = "0";
            if (temp_board[0][x] === true) {
                c = "1";
            }
            result += c;
        }
        lookup[result] = flips;
        if (flips.includes(false) === false) {
            break;
        };
        flips = increment_flips(flips);
        amount += 1;
    }
    return lookup;
}

function increment_flips(old_flips) {
    let new_flips = [];
    for (let i = 0; i < old_flips.length; i++) {
        new_flips[i] = old_flips[i];
    }
    for (let i = 0; i < new_flips.length; i++) {
        if (new_flips[i] === false) {
            new_flips[i] = true;
            break;
        } else {
            new_flips[i] = false;
        }
    }
    return new_flips;
}

function chase_lights(logical_board, moves) {
    let side_length = logical_board.length;
    for (let y = side_length - 1; y >= 1; y--) {
        for (let x = 0; x < side_length; x++) {
            if (logical_board[y][x] == true) {
                flip_tiles([x, y - 1], logical_board);
                if (moves != null) {
                    moves[y - 1][x] = !moves[y - 1][x];
                }
            }
        }
    }
}

sizebuttons.appendChild(decrease_size);
sizebuttons.appendChild(size_display);
sizebuttons.appendChild(increase_size);

update_board_size();








