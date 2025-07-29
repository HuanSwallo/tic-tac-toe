// Cell (factory function): represents a square on the board, value can equal to 'X', 'O', or null
function Cell() {
    let value = null;

    const mark = (player) => {
        if (value === null) {
            value = player;
            return true;
        }
        return false;
    };

    const getValue = () => value;

    return { mark, getValue};
}

// Player (factory function): represents player name and what mark they are using (X or O)
function Player(name, mark) {
    return {name, mark};
}

// IIFE (module pattern) for Gameboard b/c we are not creating multiple instances of a GameBoard
// Gameboard: creates the gameboard that we can use
const GameBoard = (() => {
    const board = Array.from({length: 3}, () => Array.from({length: 3}, () => Cell())); // 2-d array that creates a cell

    const getBoard = () => board;

    const placeMark = (row, column, player) => {
        return board[row][column].mark(player);
    };

    const checkWinner = () => {
        const values = board.map(row => row.map(cell => cell.getValue()));

        // All possible lines that are wins
        const validLines = [
            // Rows
            [values[0][0], values[0][1], values[0][2]],
            [values[1][0], values[1][1], values[1][2]],
            [values[2][0], values[2][1], values[2][2]],
            // Columns
            [values[0][0], values[1][0], values[2][0]],
            [values[0][1], values[1][1], values[2][1]],
            [values[0][2], values[1][2], values[2][2]],
            // Diagonals
            [values[0][0], values[1][1], values[2][2]],
            [values[0][2], values[1][1], values[2][0]]
        ];

        for (let line of validLines) {
            // Checks every element of the line and ensures if cell is not null and if each cell equals to the first element of line
            if (line.every(cell => cell !== null && cell === line[0])) {
                return line[0];
            }
        }

        return null;
    };

    const isFull = () => {
        return board.every(row => row.every(cell => cell.getValue() !== null));
    };

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                board[i][j] = Cell();
            }
        }
    }

    return {getBoard, placeMark, checkWinner, isFull, resetBoard };

})();

// DisplayController (module pattern): event listeners for rendering the gameboard and buttons
const DisplayController = (() =>{
    const startBtn = document.querySelector('.start');
    const startDisplay = document.querySelector('.start-inputs');
    const gameDisplay = document.querySelector('.game');
    const messageDisplay = document.querySelector('.message');
    const boardContainer = document.querySelector('.board');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');
    const restartBtn = document.querySelector('.restart');

    const render = () => {
        boardContainer.innerHTML = '';
        const board = GameBoard.getBoard();
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const square = document.createElement('button');
                square.classList.add('square');
                square.dataset.row = i;
                square.dataset.column = j;
                square.textContent = cell.getValue();
                boardContainer.appendChild(square);
            });
        });
    };

    const showMessage = (msg) => {
        messageDisplay.textContent = msg;
    };

    const clickHandler = (play) => {
        // Events for clicking on squares
        boardContainer.addEventListener('click', (e) => {
            const selectedSquare = e.target.classList.contains('square');
            if (!selectedSquare) return;
            const row = e.target.dataset.row;
            const column = e.target.dataset.column;
            play(parseInt(row), parseInt(column));
        });

        // Event for clicking start
        startBtn.addEventListener('click', () => {
            const name1 = player1Input.value || 'Player 1';
            const name2 = player2Input.value || 'Player 2';
            startDisplay.classList.add('hidden');
            gameDisplay.classList.remove('hidden');
            restartBtn.classList.add('hidden');
            GameController.newGame(name1, name2);
        });

        // Event for clicking restart
        restartBtn.addEventListener('click', () => {
            startDisplay.classList.remove('hidden');
            gameDisplay.classList.add('hidden');
        });
        
    };

    return {render, showMessage, clickHandler};
})();

// GameController (module pattern): validates the rounds and determines the player's turn
const GameController =(() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver;

    const newGame = (name1, name2) => {
        player1 = Player(name1, 'X');
        player2 = Player(name2, 'O');
        currentPlayer = player1;
        gameOver = false;
        GameBoard.resetBoard();
        DisplayController.render();
        DisplayController.showMessage(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    // function used to test the game 
    const playRound = (row, col) => {

        // Avoid from playing again without restarting
        if (gameOver) {
            return;
        }

        const validMove = GameBoard.placeMark(row, col, currentPlayer.mark);
        if (!validMove) {
            return;
        }

        DisplayController.render();

        const winner = GameBoard.checkWinner();
        if (winner) { 
            DisplayController.showMessage(`${currentPlayer.name} (${winner}) wins!`);
            gameOver = true;
            document.querySelector('.restart').classList.remove('hidden');
            return;
        }

        if (GameBoard.isFull()) {
            DisplayController.showMessage("It's a tie!");
            gameOver = true;
            document.querySelector('.restart').classList.remove('hidden');
            return;
        }

        switchPlayer();
        DisplayController.showMessage(`${currentPlayer.name}'s turn (${currentPlayer.mark})`);
    };

    DisplayController.clickHandler(playRound); // listens for user clicks to have game logic (GameController) work together with UI (DisplayController)

    return {newGame};
})();



/* CONSOLE VERSION OF TIC TAC TOE

// Cell (factory function): represents a square on the board, value can equal to 'X', 'O', or null
function Cell() {
    let value = null;

    const mark = (player) => {
        if (value === null) {
            value = player;
            return true;
        }
        return false;
    };

    const getValue = () => value;

    return { mark, getValue};
}

// Player (factory function): represents player name and what mark they are using (X or O)
function Player(name, mark) {
    return {name, mark};
}

// IIFE (module pattern) for Gameboard b/c we are not creating multiple instances of a GameBoard
const GameBoard = (() => {
    const board = Array.from({length: 3}, () => Array.from({length: 3}, () => Cell())); // 2-d array that creates a cell

    const getBoard = () => board;

    const placeMark = (row, column, player) => {
        return board[row][column].mark(player);
    };

    const printBoard = () => {
        const visualBoard = board.map(row => row.map(cell => cell.getValue() || '-'));
        console.log(visualBoard.map(row => row.join(' ')).join('\n'));
    };

    const checkWinner = () => {
        const values = board.map(row => row.map(cell => cell.getValue()));

        // All possible lines that are wins
        const validLines = [
            // Rows
            [values[0][0], values[0][1], values[0][2]],
            [values[1][0], values[1][1], values[1][2]],
            [values[2][0], values[2][1], values[2][2]],
            // Columns
            [values[0][0], values[1][0], values[2][0]],
            [values[0][1], values[1][1], values[2][1]],
            [values[0][2], values[1][2], values[2][2]],
            // Diagonals
            [values[0][0], values[1][1], values[2][2]],
            [values[0][2], values[1][1], values[2][0]]
        ];

        for (let line of validLines) {
            // Checks every element of the line and ensures if cell is not null and if each cell equals to the first element of line
            if (line.every(cell => cell !== null && cell === line[0])) {
                return line[0];
            }
        }

        return null;
    };

    const isFull = () => {
        return board.every(row => row.every(cell => cell.getValue() !== null));
    };

    return {getBoard, placeMark, printBoard, checkWinner, isFull };

})();

// IIFE (module pattern) for GameController b/c we are not creating multiple instances of a GameController
const GameController =(() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    // function used to test the game (EX: GameController.playRound(0, 0);)
    const playRound = (row, col) => {

        // Avoid from playing again without restarting
        if (gameOver) {
            console.log("Game is over. Start a new game to continue.");
            return;
        }

        const validMove = GameBoard.placeMark(row, col, currentPlayer.mark);
        if (!validMove) {
            console.log("Invalid move. Try another square.");
            return;
        }

        GameBoard.printBoard();

        const winner = GameBoard.checkWinner();
        if (winner) {
            console.log(`${currentPlayer.name} (${winner}) wins!`);
            gameOver = true;
            return;
        }

        if (GameBoard.isFull()) {
            console.log("It's a tie!");
            gameOver = true;
            return;
        }

        switchPlayer();
        console.log(`${currentPlayer.name}'s turn.`);
    };

    console.log(`${currentPlayer.name}'s turn.`); // Default log when opening for first time

    return {playRound};
})();

// Example game in console:
// GameController.playRound(0, 0);
// GameController.playRound(1, 0);
*/

