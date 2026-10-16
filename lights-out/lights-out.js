const game = document.getElementById('gamediv')
console.log(game);

const sizebuttons = document.getElementById('sizebuttons');
const board = document.getElementById('board');

const decrease_size = document.createElement("div");decrease_size.appendChild(document.createTextNode("➖️"));
const size_display = document.createElement("div");size_display.appendChild(document.createTextNode("7x7"));
const increase_size = document.createElement("div");increase_size.appendChild(document.createTextNode("➕️"));

decrease_size.addEventListener("click", decrease_board_size)
increase_size.addEventListener("click", increase_board_size)

console.log(decrease_size);
console.log(decrease_board_size);

let board_side_length = 7;

function decrease_board_size() {
    board_side_length -= 1;
    console.log("DECREASE -> ", board_side_length);
    update_board_size();
}

function increase_board_size() {
    board_side_length += 1;
    console.log("INCREASE -> ", board_side_length);
    update_board_size();
}

let board_grid = [];

function update_board_size() {
    board_side_length = Math.max(board_side_length, 1);
    size_display.innerText = board_side_length + "x" + board_side_length;
    board.replaceChildren();
    board_grid = [];
    for (let y = 0; y < board_side_length; y++) {
        board_grid[y] = [];
        console.log(y);
        let row = document.createElement("div");
        row.className = "lihas"; // Makes it flex!
        for (let x = 0; x < board_side_length; x++) {
            let grid_item = document.createElement("div");
            grid_item.addEventListener("click", board_clicked.bind([x, y]));
            grid_item.innerText = "⬛️";
            board_grid[y][x] = grid_item;
            row.appendChild(grid_item);
        }
        board.appendChild(row);
    }
    console.log(board_grid);
}

function board_clicked() {
    let x = this[0];
    let y = this[1];

    console.log("Board clicked at (", x, ", ", y, ")!");
}

sizebuttons.appendChild(decrease_size);
sizebuttons.appendChild(size_display);
sizebuttons.appendChild(increase_size);

update_board_size();

