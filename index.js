const board = [];
const boardSize = 4;
const boardElement = document.querySelector('[data-board]');
const numberOfBoardShuffles = 10000;

initializeGame();

function initializeGame() {
  clearBoard();
  initializeBoardData();
  
  drawBoard();

  shuffleBoard();
}

function clearBoard() {
  while(boardElement.hasChildNodes()) {
    boardElement.removeChild(boardElement.lastChild);
  }
}

function initializeBoardData() {
  for (let x = 0; x < boardSize; x++) {
    board[x] = [];
    for (let y = 0; y < boardSize; y++) {
      const isEmptyCell = x == boardSize - 1 && y == boardSize - 1;
      const elementNumber = calculateCellPosition(x, y);
      // const cellElement = document.createElement('div');
      // cellElement.classList.add('cell');
      // if (isEmptyCell) {
      //   cellElement.classList.add('empty');
      // } else {
      //   cellElement.textContent = elementNumber;
      // }
      const cell = {
        // element: cellElement,
        value: elementNumber,
        isEmptyCell,
        x,
        y
      };
      board[x].push(cell);
      // updateCellPositionOnBoard(cell);
      // const sellClickHandler = handleCellClick.bind(null, cell);
      // cellElement.addEventListener('click', sellClickHandler);
      // boardElement.appendChild(cellElement);
    }
  }
}

function drawBoard() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = board[x][y];
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      if (cell.isEmptyCell) {
        cellElement.classList.add('empty');
      } else {
        cellElement.textContent = cell.value;
      }
      cell.element = cellElement;
      updateCellDisplayPosition(cell);
      const sellClickHandler = handleCellClick.bind(null, cell);
      cellElement.addEventListener('click', sellClickHandler);
      boardElement.appendChild(cellElement);
    }
  }
}

function shuffleBoard() {
  for (let i = 0; i < numberOfBoardShuffles; i++) {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    tryMoveCell(board[x][y]);
  }
}

function calculateCellPosition(x, y) {
  return x * boardSize + y + 1;
}

function updateCellDisplayPosition(cell) {
  cell.element.style.order = calculateCellPosition(cell.x, cell.y);
}

function handleCellClick(cell, isShuffling) {
  tryMoveCell(cell); // forEach(updateCellPosition);
  checkWinStatus();
}

function tryMoveCell(cell) {
  if (cell.isEmptyCell) {
    return;
  }

  const emptyCells = getCellNeigbours(cell.x, cell.y)
    .filter(c => c.isEmptyCell);
  if (emptyCells.length == 0) {
    return;
  }

  const emptyCell = emptyCells[0];

  [ cell.x, cell.y, emptyCell.x, emptyCell.y ] = [ emptyCell.x, emptyCell.y, cell.x, cell.y ];
  [ board[cell.x][cell.y], board[emptyCell.x][emptyCell.y] ] = [ board[emptyCell.x][emptyCell.y], board[cell.x][cell.y] ];
  updateCellDisplayPosition(cell);
  updateCellDisplayPosition(emptyCell);
}

function getChangedCellsOnMove(cell) {
  if (cell.isEmptyCell) {
    return [];
  }

  const emptyCells = getCellNeigbours(cell.x, cell.y)
    .filter(c => c.isEmptyCell);
  if (emptyCells.length == 0) {
    return [];
  }

  const emptyCell = emptyCells[0];
  return [cell, emptyCell];
}

function getCellNeigbours(x, y) {
  const neighboursCordinates = [
    { x, y: y - 1 },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y}
  ];
  return neighboursCordinates.map(coords => {
    if (board[coords.x] && board[coords.x][coords.y]) {
      return board[coords.x][coords.y];
    }
  }).filter(c => c);
}

function checkWinStatus() {
  let isWinStatus = true;
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y].value != calculateCellPosition(x, y) && !board[x][y].isEmptyCell) {
        isWinStatus = false;
      }
    }
  }

  if (isWinStatus) {
    alert('you win');
  }
}
