const Gameboard = function () {
    let board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    function addSymbol(row, column, symbol) {
        success = false;

        if (row < 0 || row > 2) {
            console.error("Cannot place symbol: Row index out of bounds");
        }
        else if (column < 0 || column > 2) {
            console.error("Cannot place symbol: Column index out of bounds");
        }
        else if (board[row][column]) {
            console.error("Cannot place symbol: Space is occupied");
        }
        else {
            success = true
        }

        if (success)
            board[row][column] = symbol;

        return success;
    };

    function checkForWinner() {
        const checkSymbols = arr => {
            const firstSymbol = arr[0];
            const isWin = arr.every(symbol => symbol === firstSymbol);
            return isWin ? firstSymbol : false;
        }

        for (let row = 0; row < 3; row++) {
            const symbols = board[row];
            const winner = checkSymbols(symbols);
            if (winner) return winner;
        }

        for (let column = 0; column < 3; column++) {
            const symbols = [board[0][column], board[1][column], board[2][column]];
            const winner = checkSymbols(symbols);
            if (winner) return winner;
        }

        const diagonal1Symbols = [board[0][0], board[1][1], board[2][2]];
        const diagonal1Winner = checkSymbols(diagonal1Symbols);
        if (diagonal1Winner) return diagonal1Winner;

        const diagonal2Symbols = [board[2][0], board[1][1], board[0][2]];
        const diagonal2Winner = checkSymbols(diagonal2Symbols);
        if (diagonal2Winner) return diagonal2Winner;

        if (board.every(row => row.every(cell => cell !== null)))
            return "draw";

        return false;
    }

    function getBoard() {
        return [...board];
    }

    function reset() {
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
    }

    return { addSymbol, checkForWinner, getBoard, reset };
}();

const DisplayController = function (doc) {
    function createCell(symbol) {
        const cell = doc.createElement("span");
        cell.textContent = symbol;
        cell.classList.add("cell");
        return cell
    }

    function updateBoardElement(board) {
        if (!board)
            board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];

        const boardElement = doc.createElement("div");
        boardElement.classList.add("board");

        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                const symbol = board[row][column];
                const cell = createCell(symbol);
                cell.dataset.row = row;
                cell.dataset.column = column;

                boardElement.appendChild(cell);
            }
        }

        doc.querySelector(".board")?.remove();
        doc.body.appendChild(boardElement);

        return boardElement;
    }

    function updatePlayer(symbol) {
        const playerElement = doc.querySelector("#player")
        playerElement.textContent = symbol;
    }

    return { updateBoardElement, updatePlayer };
}(document);

const Game = function (gameboard, display) {
    let player = "X";

    function start() {
        gameboard.reset();

        player = "X";
        display.updatePlayer(player);
        
        const boardElement = display.updateBoardElement(gameboard.getBoard());
        boardElement.addEventListener("click", e => {
            const cellElement = e.target;
            if (!cellElement.classList.contains("cell"))
                return;
            if (cellElement.textContent !== "")
                return;

            const row = cellElement.dataset.row;
            const column = cellElement.dataset.column;

            cellElement.textContent = getPlayer();
            play(row, column);
        });
    }

    function play(row, column) {
        const success = gameboard.addSymbol(row, column, player);
        if (!success) {
            console.error("Error placing symbol. Aborting turn...");
            return;
        }

        const winner = gameboard.checkForWinner();
        if (winner) {
            setTimeout(() => {
                alert(`Winner: ${winner}`)
                start();
            }, 0);
            return;
        }

        player = player === "X" ? "O" : "X";
        display.updatePlayer(player);
    }

    function getPlayer() {
        return player;
    }

    return { start, play, getPlayer };
}(Gameboard, DisplayController);

const resetButton = document.querySelector("#reset-button");
resetButton.addEventListener("click", Game.start);

// Game.play(0, 1);
// Game.play(0, 2);
// Game.play(0, 0);
// Game.play(1, 0);
// Game.play(2, 2);
// Game.play(2, 1);
// document.querySelector("body").appendChild(DisplayController.createBoardElement(Gameboard.getBoard()))

Game.start();

