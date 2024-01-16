const gameBoard = (() => {
    let rows = 3;
    let columns = 3;
    let board = [];
    for (let i = 0; i < rows; i++) {
        board[i].push(Cell());
        for (let j = 0; j < columns; j++) {
            board[i][j].push(Cell());
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

const Cell = () => {
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