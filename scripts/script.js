//creats gameboard with 3x3 cells
const gameBoard = (() => {
    const rows = 3;
    const columns = 3;
    let board = [];
    for (let i = 0; i < rows; i++) {
        board.push([]);
        for (let j = 0; j < columns; j++) {
            board[i].push(cell());
        }
    }

    //returns board array
    const getBoard = () => board;

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

    //checks if cell is empty, if not, asks for another cell
    //places marker in cell
    //checks if there is a winner and prints massage if there is
    const playRound = (row, column) => {
        
        if (!isValidMove(row, column)) {
            console.log('This cell does not exist, please choose another one.');
            return;
        }
        if (!isCellEmpty(row, column)) {
            console.log('This cell is already taken, please choose another one.');
            return;
        }
        board.placeMarker(row, column, currentPlayer.getMarker());
        if (checkWin()) {
            board.printBoard();
            console.log(`${currentPlayer.getName()} wins!`);
            return;
        }
        if (!hasEmptyCells(board.getBoard())) {
            board.printBoard();
            console.log('It is a tie!');
            return;
        }
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();
    return {
        playRound,
        getCurrentPlayer,
    };
})();