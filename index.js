const board = [];
const boardSize = 4;
const boardElement = document.querySelector('[data-board]');
const numberOfBoardShuffles = 10000;
const backgroundImgUrl = './cat.jpg';
const gridGapPx = 4;
let emptyCell;

initializeGame();

function initializeGame() {
  initializeAndClearDisplayBoard();
  initializeBoard();

  shuffleBoardData();
  board.forEach(column => column.forEach(updateCellDisplayPosition));

  window.addEventListener('resize', updateBoardBackgroundSizes);
}

function initializeAndClearDisplayBoard() {
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

  while (boardElement.hasChildNodes()) {
    boardElement.removeChild(boardElement.lastChild);
  }
}

function initializeBoard() {
  for (let x = 0; x < boardSize; x++) {
    board[x] = [];
    for (let y = 0; y < boardSize; y++) {
      const cell = {
        value: calculateCellPosition(x, y),
        isEmptyCell: x == boardSize - 1 && y == boardSize - 1,
        x,
        y
      };

      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      if (cell.isEmptyCell) {
        emptyCell = cell;
        cellElement.classList.add('empty');
      } else {
        cellElement.textContent = cell.value;

        cellElement.style.backgroundImage = `url(${backgroundImgUrl})`;
        const gridTrackGapSizePx = gridGapPx * (boardSize - 1);
        cellElement.style.backgroundSize = `${boardElement.clientWidth - gridTrackGapSizePx}px ${boardElement.clientHeight - gridTrackGapSizePx}px`;
        cellElement.style.backgroundPosition = `-${100 * x}% -${100 * y}%`;
      }
      cell.element = cellElement;
      updateCellDisplayPosition(cell);
      cellElement.addEventListener('click', handleCellClick.bind(null, cell));
      boardElement.appendChild(cellElement);

      board[x].push(cell);
    }
  }
}

function updateBoardBackgroundSizes() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = board[x][y];
      if (cell.isEmptyCell) {
        continue;
      }
      cell.element.style.backgroundSize =
        `${boardElement.clientWidth}px ${boardElement.clientHeight}px`;
    }
  }
}

function shuffleBoardData() {
  for (let i = 0; i < numberOfBoardShuffles; i++) {
    const emptyCellNeighbours = getCellNeigbours(emptyCell.x, emptyCell.y);
    tryMoveCellAndGetChangedCells(emptyCellNeighbours[
      Math.floor(Math.random() * emptyCellNeighbours.length)]);
  }
}

function calculateCellPosition(x, y) {
  return y * boardSize + x + 1;
}

function updateCellDisplayPosition(cell) {
  cell.element.style.gridColumn = `${cell.x + 1} / span 1`;
  cell.element.style.gridRow = `${cell.y + 1} / span 1`;
}

function handleCellClick(cell, isShuffling) {
  tryMoveCellAndGetChangedCells(cell).forEach(updateCellDisplayPosition);
  checkWinStatus();
}

function tryMoveCellAndGetChangedCells(cell) {
  if (cell.isEmptyCell) {
    return [];
  }

  const isEmptyCellInNeighbours = getCellNeigbours(cell.x, cell.y)
    .some(c => c.isEmptyCell);
  if (!isEmptyCellInNeighbours) {
    return [];
  }

  [cell.x, cell.y, emptyCell.x, emptyCell.y] = [emptyCell.x, emptyCell.y, cell.x, cell.y];
  [board[cell.x][cell.y], board[emptyCell.x][emptyCell.y]] = [board[emptyCell.x][emptyCell.y], board[cell.x][cell.y]];

  return [cell, emptyCell];
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
    { x: x - 1, y }
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
