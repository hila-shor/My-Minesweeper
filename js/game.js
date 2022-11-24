// timer that starts on first click (right / left) and stops when game is over.
//TO DO: Left click reveals the cell’s content
//TO DO:  Right click flags/unflags a suspected cell (you cannot reveal a flagged cell)
//TO DO:
//TO DO:
//TO DO:






// icons

const NORMAL = '🤓'
const LOSE = '😖'
const WIN = '💪'
const FLEG = '🚩'
const MINE = '💣'
const EMPTY = ' '
const COVER = '-'

//global vairiable
var gInterval = null
var gBoard
var gLevel = {
  size: 4,
  mines: 2
}
var gLevels = [{ size: 4, mines: 2 }, { size: 8, mines: 14 }, { size: 12, mines: 32 },]
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  clickcount: 0
}
// var gPosMines = [{ i: 0, j: 0 }, { i: 2, j: 2 }]





function initGame() {

  gInterval = null
  clearInterval(gInterval)
  gInterval = null


  gBoard = buildBoard()
  console.log(gBoard)
  renderBoard(gBoard)
  console.log('gBoard after negs update : ', gBoard)
  getMinesRandLocation()
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
  console.log(gBoard)


}
function upDategLevel(size, mines) {
  gLevel.size = size
  gLevel.mines = mines

  //TODO: clear the timer

  gInterval = null
  initGame()
  clearInterval(gInterval)

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
      strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" onmouseup="onMouseUp(event, this,${i},${j})">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elboard = document.querySelector('.game-board')
  elboard.innerHTML = strHTML
}
function onMouseUp(eve, elbtd, i, j) {

  //handel the pop up setting when clicking right click on mouse

  // eve.preventDefault()
  // eve.stopImmediatePropagation()

  //starting timer on right\left mouse up
  if (eve.button === 0 || eve.button === 2) {
    gGame.clickcount++
    // console.log('click count: ', gGame.clickcount)
    if (gGame.clickcount === 1) gInterval = setInterval(timer, 1000)

  }

  if (eve.button === 0) {
    console.log('The left mouse button')

  }
  //handel right mouse up

  if (eve.button === 2) {
    // eve.preventDefault()
    console.log('The right mouse button')
    console.log('event mouseup: ', eve)
    console.log('i,j :', i, j)
    //update model:
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    console.log(gBoard[i][j].isMarked)
    // if (gBoard[i][j].isMarked) gBoard[i][j].isMarked = false
    // else if (!gBoard[i][j].isMarked) gBoard[i][j].isMarked = true
    //for update Dom:
    var elTd = elbtd
    console.log('elTd: ', elTd)
    elTd.innerText = (gBoard[i][j].isMarked) ? FLEG : COVER

  }

  // console.log('mouse eve.button: ', eve.button)

}
function onCellClicked(elCell, i, j) {

  if (checkGameOver(i, j)) gameOver()
  // gGame.clickcount++
  console.log('click count: ', gGame.clickcount)

  // if (gGame.clickcount === 1) {
  //   gInterval = setInterval(timer, 1000)
  // }

  //UPDATE MODEL:
  gBoard[i][j].isShown = true
  if (gBoard[i][j].minesAroundCount === 0) {
    revealNegs(gBoard, i, j)
    renderBoard(gBoard)
    return
  }
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
function checkGameOver(posi, posj) {
  return (gBoard[posi][posj].isMine)
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

function timer() {
  //sec
  var elSec = document.querySelector('.sec')
  var currSec = elSec.innerText
  currSec++
  elSec.innerText = currSec
  //min
  var elMin = document.querySelector('.min')
  var currMin = elMin.innerText
  // console.log(currMin)
  if (currSec > 60) {
    currMin++
    elMin.innerText = currMin
    // reset the sec
    currSec = 0
    elSec.innerText = currSec
  }
}

function revealNegs(board, posi, posj) {
  if (board[posi][posj].minesAroundCount === 0) {
    for (var i = posi - 1; i <= posi + 1; i++) {
      if (i < 0 || i >= board.length) continue;
      for (var j = posj - 1; j <= posj + 1; j++) {
        if (j < 0 || j >= board[i].length) continue;
        if (i === posi && j === posj) continue;
        board[i][j].isShown = true
      }
    }
  }
}

function gameOver() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; i++) {

    }
  }
}