'use strict'

const FLAG = '#'
const MINE = '🎇';
const EMPTY = ' ';

var gTimer;
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
var gCell;
// function logTableModel() {
//   console.table(
//     gBoard.map((arr) =>
//       arr.map((cell) =>
//         cell.isMine
//           ? MINE
//           : cell.minesAroundCount
//             ? cell.minesAroundCount
//             : 0,
//       ),
//     ),
//   );
// }
function init() {

  gBoard = buildBoard(gLevel);
  
  renderBoard(gBoard)
  restartGame()
  gGame.isOn = false
  // logTableModel()
  generateRandomMines(gLevel.MINES)
}

function gameDifeculty(level) {
  
  if (level === 'easy') {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
  }
  if (level === 'medium') {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
  }
  if (level === 'hard') {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
  }
  
  init()
}


function buildBoard() {
  var board = createMat(gLevel.SIZE)
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      
      board[i][j] = gCell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
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

      strHTML += `<td class="cell-${i}-${j}"
       onclick="cellClicked(this,${i},${j})" 
       oncontextmenu="cellMarked(this,${i},${j})">    
       ${currCell}</td>`
    }
    strHTML += '</tr>\n';

  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}


function cellClicked(elCell, i, j) {
  var sec = 1;
  var cell = gBoard[i][j]
  if (!gGame.isOn) {
    gGame.isOn = true;
    gTimer = setInterval(function () {
      var time = new Date(sec * 1000).toString().split(':');
      var currTime = time[1] + ':' + time[2].split(' ')[0];
      document.querySelector('.timer').innerHTML = currTime;
      sec++;
    }, 1000);
  }

  if (cell.isMine) {
    clearInterval(gTimer);
    restartGame()
    var elRes = document.querySelector('.restart-game');
    elRes.style.display = 'block';

  } else {
    expandShown(gBoard, i, j);
  }

  if (cell.minesAroundCount < 1) {
    cell.isShown = true
  }
  var display = cell.isMine ? MINE : cell.minesAroundCount
  console.log('display:', display)
  renderCell({ i: i, j: j }, display)
}

function cellMarked(elCell, i, j) {
  window.oncontextmenu = function () {
    elCell.isMine = true;
    elCell.innerText = FLAG;
    gBoard[i][j].isMarked = true;

    if (elCell.isMarked) {
      gGame.markedCount++
      if (gGame.markedCount > 3) {
        elCell.isMarked = false
        var elFlag = document.querySelector('flag');
        elFlag.innerText = 'no bomes!'
      }
    }
    if (checkGameOver()) {
      alert('winner')
    }
  }

}
function generateRandomMines(mines) {

  for (var i = 0; i < mines; i++) {
    var emptyCells = getEmptyCells(gBoard);
    var randIdx = getRandomInt(0, emptyCells.length);
    var emptyPosition = emptyCells[randIdx];
    // console.log('emptyPosition:', emptyPosition)
    gBoard[emptyPosition.i][emptyPosition.j].isMine = true;  
  }

}
function getEmptyCells(gBoard) {
  var emptyCells = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j]
      var position = {
        i: i,
        j: j
      }
      if (!cell.isMine) {
        emptyCells.push(position)
      }
    }
  }
  console.log('emptyCells:', emptyCells)

  return emptyCells

}

function expandShown(board, i, j) {
  var matrix = getMinesNegsCount(i, j, board);
  for (var i = 0; i < matrix.length; i++) {
    if (matrix[i]) {
      renderCell({ i: matrix[i][0], j: matrix[i][1] }, setMinesNegsCount(i, j, board));
      // console.log('marix is:', matrix)
      gBoard[matrix[i][0]][matrix[i][1]].isShown = true;

    }
  }
}

function getMinesNegsCount(cellI, cellJ, mat) {
  var matrix = []
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if ((i === cellI && j === cellJ) || j < 0 || j >= mat[i].length) continue;
      if (!mat[i][j].isMine) {
        matrix[i + j] = [i, j];
      }
    }
  }
  return matrix;
}
function checkGameOver() {
  var countMine = 0;
  var countShown = 0;
  var countMarked = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isShown) countShown++;
      if (gBoard[i][j].isMine) countMine++;
      if (gBoard[i][j].isMarked) countMarked++;
    }
  }
  if ((countMarked + countShown) === (gBoard.length * gBoard.length)) return true;
  else return false;
}



function setMinesNegsCount(cellI, cellJ, mat) {
  var countMinsNegs = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j > mat[i].length - 1) continue;
      if (mat[i][j].isMine) countMinsNegs++
      console.log('mat[i][j].isMine:', mat[i][j].isMine)
    }
  }

  console.log('countMinsNegs:', countMinsNegs)
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

function restartGame() {
  var elRes = document.querySelector('.restart-game');
  elRes.style.display = 'none';
  document.querySelector('.timer').innerHTML = '00:00';
}

