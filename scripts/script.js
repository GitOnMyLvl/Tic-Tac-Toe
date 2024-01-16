const gameBoard = (() => {
    let rows = 3;
    let columns = 3;
    let board = [];
    for (let i = 0; i < rows; i++) {
        board.push([]);
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    const placeMarker = (row, column, player) => {
        board[row][column].addMarker(player);
    }

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

function Cell() {
    let value = 0;
    const addMarker = (player) => {
        value = player;
    };
    const getValue = () => value;
    return { 
        addMarker,
        getValue,
     };
}

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
    const players = [createPlayer('Player 1', 'X'), createPlayer('Player 2', 'O')];
    let currentPlayer = players[0];
    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };
    const getCurrentPlayer = () => currentPlayer;
    const printNewRound = () => {
        board.printBoard();
        console.log(`New round! ${currentPlayer.getName()} turn.`);
    };
    const checkWin = () => {
        
    };
    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() !== 0) {
            console.log('This cell is already taken, please choose another one.');
            return;
        }
        board.placeMarker(row, column, currentPlayer.getMarker());
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();
    return {
        playRound,
        getCurrentPlayer,
    };
})();