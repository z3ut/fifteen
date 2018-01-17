let board = [];
let boardSize = 4;
let emptyCell;
const boardElement = document.querySelector('[data-board]');
const numberOfBoardShuffles = 10000;
const backgroundImgUrl = './cat.jpg';
const gridGapPx = 4;

let numberOfSteps;
let dateStartGame;

const buttonStartNewGameElement = document.querySelector('[data-button-start-new-game]');
const boardSizeSelectElement = document.querySelector('[data-board-size-select]');

initialize();
startNewGame();

function initialize() {
  window.addEventListener('resize', updateBoardBackgroundSizes);

  buttonStartNewGameElement.addEventListener('click', startNewGame);
}

function startNewGame() {
  numberOfSteps = 0;
  dateStartGame = new Date();

  initializeBoard();
  shuffleBoard();
}

function initializeBoard() {
  boardSize = +boardSizeSelectElement.options[boardSizeSelectElement.selectedIndex].value;

  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

  while (boardElement.hasChildNodes()) {
    boardElement.removeChild(boardElement.lastChild);
  }

  board = [];
  for (let x = 0; x < boardSize; x++) {
    board[x] = [];
    for (let y = 0; y < boardSize; y++) {
      const cell = {
        value: calculateCellPosition(x, y),
        element: document.createElement('div'),
        isEmptyCell: x == boardSize - 1 && y == boardSize - 1,
        x,
        y
      };

      const cellElement = document.createElement('div');
      cell.element.classList.add('cell');
      if (cell.isEmptyCell) {
        emptyCell = cell;
        cell.element.classList.add('empty');
      } else {
        cell.element.textContent = cell.value;
        cell.element.style.backgroundImage = `url(${backgroundImgUrl})`;
        const gridTrackGapSizePx = gridGapPx * (boardSize - 1);
        cell.element.style.backgroundSize = `${boardElement.clientWidth - gridTrackGapSizePx}px ${boardElement.clientHeight - gridTrackGapSizePx}px`;
        cell.element.style.backgroundPosition = `-${100 * x}% -${100 * y}%`;
      }

      updateCellDisplayPosition(cell);
      cell.element.addEventListener('click', handleCellClick.bind(null, cell));
      boardElement.appendChild(cell.element);

      board[x].push(cell);
    }
  }
}

function shuffleBoard() {
  for (let i = 0; i < numberOfBoardShuffles; i++) {
    const emptyCellNeighbours = getCellNeigbours(emptyCell.x, emptyCell.y);
    tryMoveCellAndGetChangedCells(emptyCellNeighbours[
      Math.floor(Math.random() * emptyCellNeighbours.length)]);
  }
  board.forEach(column => column.forEach(updateCellDisplayPosition));
}

function updateBoardBackgroundSizes() {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const cell = board[x][y];
      if (cell.isEmptyCell) {
        continue;
      }
      cell.element.style.backgroundSize = `${boardElement.clientWidth}px ${boardElement.clientHeight}px`;
    }
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
  const updatedCells = tryMoveCellAndGetChangedCells(cell);
  if (updatedCells.length > 0) {
    updatedCells.forEach(updateCellDisplayPosition);
    numberOfSteps++;
  }
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
    const gameTime = Math.ceil((new Date().getTime() - dateStartGame.getTime()) / 1000);
    alert(`You win.\nGame time: ${gameTime}s\nNumber of steps: ${numberOfSteps}`);
    startNewGame();
  }
}
