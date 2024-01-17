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
  };

  return {
    getBoard,
    resetBoard,
    placeMarker,
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

const displayController = (() => {
  const boardContainer = document.querySelector(".board-container");
  const resetButton = document.querySelector(".reset-button");
  const gameInfo = document.querySelector(".game-info");
  const xNameInput = document.querySelector(".x-name");
  const oNameInput = document.querySelector(".o-name");
  const board = gameBoard.getBoard();

  //displays marker in cell
  const displayMarker = (row, column, cell) => {
    if (gameController.getGameOngoing()) {
      if (cell.textContent !== "") {
        return;
      }
      cell.textContent = gameController.getCurrentPlayer().getMarker();
      gameController.playRound(row, column);
    }
  };

  const displayGameInfo = (message) => {
    gameInfo.textContent = message;
  };

  xNameInput.addEventListener("change", () => {
    gameController.changePlayerName(
      gameController.getXPlayer(),
      xNameInput.value
    );
    displayGameInfo(`${gameController.getCurrentPlayer().getName()}'s turn.`);
  });

  oNameInput.addEventListener("change", () => {
    gameController.changePlayerName(
      gameController.getOPlayer(),
      oNameInput.value
    );
    displayGameInfo(`${gameController.getCurrentPlayer().getName()}'s turn.`);
  });

  //creates board in html
  for (let i = 0; i < board.length; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < board[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-column", j);
      cell.addEventListener("click", () => {
        displayMarker(i, j, cell);
      });
      cell.textContent = "";
      row.appendChild(cell);
    }
    boardContainer.appendChild(row);
  }

  //resets game when reset button is clicked
  resetButton.addEventListener("click", () => {
    gameController.resetGame();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => (cell.textContent = ""));
  });

  return {
    displayGameInfo,
  };
})();

const gameController = (() => {
  const board = gameBoard;

  //gameOngoing is true until there is a winner or a tie
  let gameOngoing = true;

  const getGameOngoing = () => gameOngoing;

  const playerType = {
    HUMAN: "human",
    EASY_AI: "Easy AI",
    MEDIUM_AI: "Medium AI",
    HARD_AI: "Hard AI",
  };

  function createPlayer(name, marker, type) {
    const getName = () => name;
    const setName = (newName) => (name = newName);
    const getMarker = () => marker;
    return {
      name: name,
      marker: marker,
      type: type,
      getName,
      setName,
      getMarker,
    };
  }

  //creates two players
  const players = [
    createPlayer("Player 1", "X", playerType.HUMAN),
    createPlayer("Player 2", "O", playerType.HUMAN),
  ];

  //switches player turn
  let currentPlayer = players[0];

  const getXPlayer = () => players[0];
  const getOPlayer = () => players[1];

  const changePlayerName = (player, newName) => {
    player.setName(newName);
  };

  const switchPlayerTurn = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const generateComputerMove = (difficulty) => {
    const boardSize = 3;
    let row;
    let column;

    if (difficulty === "Easy AI") {
      do {
        row = Math.floor(Math.random() * boardSize);
        column = Math.floor(Math.random() * boardSize);
      } while (!isCellEmpty(row, column));
      return { row, column };
    }

    if (difficulty === "Medium AI") {
    }
  };

  const getCurrentPlayer = () => currentPlayer;

  const printNewRound = () => {
    displayController.displayGameInfo(`${currentPlayer.getName()}'s turn.`);
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
      if (
        isSameAndNotEmpty(
          board.getBoard()[i][0],
          board.getBoard()[i][1],
          board.getBoard()[i][2]
        )
      ) {
        return true;
      }
    }
  };

  const checkColumns = () => {
    for (let j = 0; j < 3; j++) {
      if (
        isSameAndNotEmpty(
          board.getBoard()[0][j],
          board.getBoard()[1][j],
          board.getBoard()[2][j]
        )
      ) {
        return true;
      }
    }
  };

  const checkDiagonals = () =>
    isSameAndNotEmpty(
      board.getBoard()[0][0],
      board.getBoard()[1][1],
      board.getBoard()[2][2]
    ) ||
    isSameAndNotEmpty(
      board.getBoard()[0][2],
      board.getBoard()[1][1],
      board.getBoard()[2][0]
    );

  //checks if there is a winner
  const checkWin = () => {
    return checkRows() || checkColumns() || checkDiagonals();
  };

  const isValidMove = (row, column) => {
    const boardSize = 3;
    return row >= 0 && row < boardSize && column >= 0 && column < boardSize;
  };

  const isCellEmpty = (row, column) =>
    board.getBoard()[row][column].getValue() === 0;

  const hasEmptyCells = (board) => {
    return board.some((row) => row.some((cell) => cell.getValue() === 0));
  };

  const makeMove = (row, column) => {
    board.placeMarker(row, column, currentPlayer.getMarker());
  };

  //checks if cell is empty, if not, asks for another cell
  //places marker in cell
  //checks if there is a winner and prints massage if there is
  const playRound = (row, column) => {
    if (!gameOngoing) {
      return;
    }
    if (!isValidMove(row, column)) {
      return;
    }
    if (!isCellEmpty(row, column)) {
      return;
    }

    makeMove(row, column);

    if (checkWin()) {
      displayController.displayGameInfo(`${currentPlayer.getName()} wins!`);
      gameOngoing = false;
      return;
    }

    if (!hasEmptyCells(board.getBoard())) {
      displayController.displayGameInfo("It is a tie!");
      gameOngoing = false;
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();
  return {
    getGameOngoing,
    changePlayerName,
    getXPlayer,
    getOPlayer,
    resetGame,
    playRound,
    getCurrentPlayer,
  };
})();
