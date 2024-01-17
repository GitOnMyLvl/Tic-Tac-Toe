//creats gameboard with 3x3 cells
const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    let board = [];
    //creates board array with 3x3 cells
    const createBoard = () => {
        for (let i = 0; i < rows; i++) {
            board.push([]);
            for (let j = 0; j < columns; j++) {
                board[i].push(cell());
            }
        }
    };

    createBoard();

    //returns board array
    const getBoard = () => board;

    //resets board
    const resetBoard = () => {
        board = [];
        createBoard();
    };

    //places marker in cell
    const placeMarker = (row, column, player) => {
        board[row][column].addMarker(player);
    }

    //prints board in console
    const printBoard = () => {
        const boardWithMarkers = board.map(row => row.map(cell => cell.getValue()));
        console.table(boardWithMarkers);
    };

    return {
        getBoard,
        resetBoard,
        placeMarker,
        printBoard,
    };

})();

function cell() {
    let value = 0;

    //adds marker to cell
    const addMarker = (player) => {
        value = player;
    };
    const getValue = () => value;
    return {
        addMarker,
        getValue,
    };
}

//player factory
function createPlayer(name, marker) {
    const getName = () => name;
    const setName = (newName) => name = newName;
    const getMarker = () => marker;
    return {
        name: name,
        marker: marker,
        getName,
        setName,
        getMarker,
    };
}

const gameController = (() => {
    const board = gameBoard;

    //gameOngoing is true until there is a winner or a tie
    let gameOngoing = true;

    const getGameOngoing = () => gameOngoing;

    //creates two players
    const players = [createPlayer('Player 1', 'X'), createPlayer('Player 2', 'O')];

    //switches player turn
    let currentPlayer = players[0];
    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };
    const getCurrentPlayer = () => currentPlayer;
    const printNewRound = () => {
        board.printBoard();
        console.log(`New round! ${currentPlayer.getName()} turn.`);
    };

    const resetGame = () => {
        board.resetBoard();
        gameOngoing = true;
        currentPlayer = players[0];
        printNewRound();
    };

    //helper function to check if three cells are the same and not empty
    const isSameAndNotEmpty = (cell1, cell2, cell3) =>
        cell1.getValue() !== 0 &&
        cell1.getValue() === cell2.getValue() &&
        cell2.getValue() === cell3.getValue();

    //three functions to checks if there are three same markers in a row, column or diagonal
    const checkRows = () => {
        for (let i = 0; i < 3; i++) {
            if (isSameAndNotEmpty(board.getBoard()[i][0], board.getBoard()[i][1], board.getBoard()[i][2])) {
                return true;
            }
        }
    };
    const checkColumns = () => {
        for (let j = 0; j < 3; j++) {
            if (isSameAndNotEmpty(board.getBoard()[0][j], board.getBoard()[1][j], board.getBoard()[2][j])) {
                return true;
            }
        }
    };
    const checkDiagonals = () => isSameAndNotEmpty(board.getBoard()[0][0], board.getBoard()[1][1], board.getBoard()[2][2]) ||
        isSameAndNotEmpty(board.getBoard()[0][2], board.getBoard()[1][1], board.getBoard()[2][0]);

    //checks if there is a winner
    const checkWin = () => {
        return checkRows() || checkColumns() || checkDiagonals();
    };


    const isValidMove = (row, column) => {
        const boardSize = 3;
        return row >= 0 && row < boardSize && column >= 0 && column < boardSize;
    };

    const isCellEmpty = (row, column) => board.getBoard()[row][column].getValue() === 0;

    const hasEmptyCells = (board) => {
        return board.some(row => row.some(cell => cell.getValue() === 0));
    };

    const makeMove = (row, column) => {
        board.placeMarker(row, column, currentPlayer.getMarker());
    }


    //checks if cell is empty, if not, asks for another cell
    //places marker in cell
    //checks if there is a winner and prints massage if there is
    const playRound = (row, column) => {
        if (!gameOngoing) {
            console.log('The game is over, please start a new one.');
            return;
        }
        if (!isValidMove(row, column)) {
            console.log('This cell does not exist, please choose another one.');
            return;
        }
        if (!isCellEmpty(row, column)) {
            console.log('This cell is already taken, please choose another one.');
            return;
        }
        makeMove(row, column);
        if (checkWin()) {
            board.printBoard();
            console.log(`${currentPlayer.getName()} wins!`);
            gameOngoing = false;
            return;
        }
        if (!hasEmptyCells(board.getBoard())) {
            board.printBoard();
            console.log('It is a tie!');
            gameOngoing = false;
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();
    return {
        getGameOngoing,
        resetGame,
        playRound,
        getCurrentPlayer,
    };
})();

const displayController = (() => {
    const boardContainer = document.querySelector('.board-container');
    const resetButton = document.querySelector('.reset-button');
    const board = gameBoard.getBoard();

    

    for (let i = 0; i < board.length; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < board[i].length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-column', j);
            cell.addEventListener('click', () => {
                if (gameController.getGameOngoing()) {
                    cell.textContent = gameController.getCurrentPlayer().getMarker();
                    gameController.playRound(i, j);
                }
            });
            cell.textContent = "";
            row.appendChild(cell);
        }
        boardContainer.appendChild(row);
    }
    
    resetButton.addEventListener('click', () => {
        gameController.resetGame();
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.textContent = "");
    });
})();

