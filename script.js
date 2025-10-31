const Gameboard = function () {
    const board = [
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

        return false;
    }

    function getBoard() {
        return [...board];
    }

    return { addSymbol, checkForWinner, getBoard };
}();

const Game = function (gameboard) {
    let isPlayer1Turn = false;

    function getState() {
        return {
            winner: gameboard.checkForWinner(),
            board: gameboard.getBoard(),
        }
    }

    function play(row, column) {
        const symbol = isPlayer1Turn ? "X" : "O";

        const success = Gameboard.addSymbol(row, column, symbol);
        if (!success) {
            console.error("Error placing symbol. Aborting turn...");
            return;
        }
        
        const gameState = getState();
        if (gameState.winner) {
            console.log(`Winner: ${gameState.winner}`);
        }

        isPlayer1Turn = !isPlayer1Turn;
        console.log(`PLAYER: ${isPlayer1Turn ? "X" : "O"}`);
        return gameState.board;
    }


    return { play, getState };
}(Gameboard);