// icons

const HAPPY_SMILEY = '😊'
const SMILE_2 = '🤯'
const SMILE_3 = '😖 '
const FLEG = '🚩'
const MINE = '💣'
const EMPTY = ' '
const COVER = '-'

//global vairiable
var gBoard
var gLevel = {
  size: 4,
  mines: 2
}

var gGame
var gPosMines = [{ i: 0, j: 0 }, { i: 2, j: 2 }]



function initGame() {
  gBoard = buildBoard()
  console.log(gBoard)
  renderBoard(gBoard)
  console.log('gBoard after negs update : ', gBoard)
  getMinesRandLocation()
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  console.log(gBoard)

}

function buildBoard() {
  var size = gLevel.size
  const board = []
  for (var i = 0; i < size; i++) {
    board[i] = []
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: null,
        isShown: false,
        isMine: false,
        isMarked: false,
      }
    }
  }
  // board[0][0].isMine = true
  // board[2][2].isMine = true


  return board
}

function getMinesRandLocation() {

  var count = 0

  while (count < gLevel.mines) {

    var posI = getRandomInt(0, gLevel.size)
    var posJ = getRandomInt(0, gLevel.size)

    if (gBoard[posI][posJ].isMine) continue
    //update model
    gBoard[posI][posJ].isMine = true
    count++

  }

}



function setMinesNegsCount(board) {
  // console.log('in setMinesNegsCount')
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currNegsCount = countNeighbors(i, j, board)
      if (board[i][j].isMine) continue
      board[i][j].minesAroundCount = currNegsCount
    }
  }
}

function renderBoard(board) {

  var strHTML = '<table> <tbody>'
  for (var i = 0; i < board.length; i++) {

    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      var currCell = gBoard[i][j]
      var cell = ''
      if (!currCell.isShown) {
        cell = COVER
      } else if (currCell.isMine && currCell.isShown && !currCell.isMarked) {
        cell = MINE
      } else if (!currCell.isMine && currCell.isShown && !currCell.isMarked) {
        cell = currCell.minesAroundCount
      } else if (currCell.isMarked) {
        cell = FLEG
      }
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className}" onclick="onCellClicked(event,this,${i},${j})">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elboard = document.querySelector('.game-board')
  elboard.innerHTML = strHTML
}

function onCellClicked(eve, elCell, i, j) {
  console.log('cell clicked :>> ', i, j);
  console.log('elCell :>> ', elCell);
  //UPDATE MODEL:
  gBoard[i][j].isShown = true
  //UPDATE DOM:
  renderCell(i, j, elCell)
}

function renderCell(i, j, elCell) {
  // Select the elCell and set the value
  // const elCell = document.querySelector(`.cell-${i}-${j}`)
  var value
  if (gBoard[i][j].isMine) value = MINE
  else if (!gBoard[i][j].isMine && gBoard[i][j].isShown) value = gBoard[i][j].minesAroundCount
  elCell.innerText = value
}

function cellMarked(elCell) {

}
function checkGameOver() {

}
function expandShown(board, elCell, i, j) {

}
function countNeighbors(cellI, cellJ, board) {
  var negsCount = 0;

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine === true) negsCount++;
    }
  }
  return negsCount;
}