'use strict'


const MINE = 'MINE';
const EMPTY = ' ';

var gElselectedCell = null

var gCell = {
  minesAroundCount: 4,
  isShown: true,
  isMine: false,
  isMarked: true,
}

var gBoard;

var gLevel = {
  SIZE: 4,
  MINES: 2
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
}

function cellMaker() {
  var cell = {
    minesAroundCount: 0,
    isShown: false,
    isMine: false,
    isMarked: false,
  }
  return cell;
}

function logTableModel() {
  console.table(
    gBoard.map((arr) =>
      arr.map((cell) =>
        cell.isMine
          ? MINE
          : cell.minesAroundCount
            ? cell.minesAroundCount
            : 0,
      ),
    ),
  );
}
function init() {

  gBoard = buildBoard();
  renderBoard(gBoard)
  logTableModel()
  console.log('gBoard:', gBoard)
}


function buildBoard() {
  var board = createMat(gLevel.SIZE)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {

      board[i][j] = cellMaker()
    }
  }

  board[0][1].isMine = true;
  board[2][1].isMine = true;

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      board[i][j].minesAroundCount = setMinesNegsCount(i, j, board)

    }
  }
  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < board[0].length; j++) {

      var currCell = EMPTY;

      strHTML += `<td class="cell-${i}-${j}" onclick="cellClicked(this,${i},${j})">
      ${currCell}</td>`
    }
    strHTML += '</tr>\n';

  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
  // console.log('currCell:', currCell)
  // console.log('strHTML:', strHTML)
}

function cellClicked(elBtn, i, j) {
  // console.log('elBtn, i, j:', elBtn, i, j);

  var modelCell = gBoard[i][j]
  console.log('modelCell:', modelCell)
  if (modelCell.isMine) {
    // game over
  }

  // if (cell.minesAroundCount < 1) {
  //   //open neighbours that are not mines

  // }
  var minesNegb = setMinesNegsCount(i, j, gBoard)
  var display = modelCell.isMine ? MINE : modelCell.minesAroundCount
  renderCell({ i: i, j: j }, display)

  // if (!gCell.isShown){
  //   gCell.isShown = true;
  // }

}

function setMinesNegsCount(cellI, cellJ, mat) {
  var countMinsNegs = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j > mat[i].length - 1) continue;
      if (mat[i][j].isMine) countMinsNegs++
    }
  }

  return countMinsNegs;
}


function renderCell(location, value) {
  var cellSelector = '.' + getClassName(location)
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

