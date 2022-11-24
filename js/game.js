
//TO DO: unable oncellclic/ onmouseup after lose - unreveal  close cells after gameover

//TO DO: first click no mine
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
var gTimerInterval = null
var gBoard
const gLevel = {
  size: 4,
  mines: 2
}
const gLevels = [{ size: 4, mines: 2 }, { size: 8, mines: 14 }, { size: 12, mines: 32 },]
var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  clickcount: 0,
  isMinesRender: false
}
var gPosMines = []

//timer globals
var gTimerInterval = null

///////////////////////////////////FUNCTIONS//////////////////////////////////////////////////

function initGame() {
  gGame.clickcount = 0
  resetTimer()
  gBoard = buildBoard()
  console.log(gBoard)
  renderBoard(gBoard)
  console.log('gBoard after negs update : ', gBoard)
  console.log(gBoard)
}
function onMouseUp(eve, elbtd, i, j) {

  if (gGame.isOn === false) return

  //handel the pop up setting when clicking right click on mouse
  // eve.preventDefault()
  // eve.stopImmediatePropagation()

  //starting timer on right\left mouse up
  if (eve.button === 0 || eve.button === 2) {
    gGame.clickcount++
    // console.log('click count: ', gGame.clickcount)
    if (gGame.clickcount === 1) {
      startTimer()
      console.log(gGame.clickcount)
    }


  }
  //handel left mouse up- nothing for now
  if (eve.button === 0) {
    console.log('The left mouse button')

    // if (gGame.isOn = false) return
  }

  //handel right mouse up- marked and unmarked cell
  if (eve.button === 2) {
    console.log('The right mouse button')

    //update model:
    cellMarked(elbtd, i, j)
  }
  console.log('gGame.markedCount: ', gGame.markedCount)
  if (gGame.markedCount === gLevel.mines) {
    if (checkWin()) winGame()

  }
}
function updateLevel(size, mines) {
  gLevel.size = size
  gLevel.mines = mines
  initGame()

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
function getMinesRandLocation(i, j) {

  var minesPosCount = 0

  while (minesPosCount < gLevel.mines) {

    var posI = getRandomInt(0, gLevel.size)
    var posJ = getRandomInt(0, gLevel.size)

    if (posI === i && posJ === j) continue
    if (gBoard[posI][posJ].isMine) continue

    //update model
    gBoard[posI][posJ].isMine = true
    //save in global variable
    gPosMines.push({ i: posI, j: posJ })

    minesPosCount++
  }
  gGame.isMinesRender = true
  console.log('gPosMines :>> ', gPosMines);
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
      if (!currCell.isShown && !currCell.isMarked) cell = COVER
      else if (currCell.isMine && currCell.isShown && !currCell.isMarked) cell = MINE
      else if (currCell.isMarked === true) cell = FLEG
      else if (!currCell.isMine && currCell.isShown && !currCell.isMarked) {
        cell = currCell.minesAroundCount
        if (currCell.minesAroundCount === 0) cell = EMPTY
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


function onCellClicked(elCell, i, j) {

  if (!gGame.isMinesRender) {
    getMinesRandLocation(i, j)
    setMinesNegsCount(gBoard)
  }
  if (gBoard[i][j].isShown) return
  console.log(gGame.clickcount)

  // to do- when game over dont reveal cells anymore
  if (gGame.isOn === false) return

  //////////////////////////////////////////
  //CHECK GAME OVER
  if (checkGameOver(i, j)) {
    gameOver()
    return
  }

  //UPDATE MODEL:
  gBoard[i][j].isShown = true
  gGame.shownCount++
  console.log(gGame.shownCount)
  // when there is enough opencells check win
  if (gGame.shownCount === gLevel.size * gLevel.size - gLevel.mines) {
    if (checkWin()) winGame()
  }
  //open negs and update dom
  if (gBoard[i][j].minesAroundCount === 0) {
    revealNegs(gBoard, i, j)
    console.log(gGame.shownCount)
  }

  //UPDATE DOM:
  renderCell(i, j)

}

function renderCell(i, j) {

  //update model
  var value
  if (gBoard[i][j].isMine) value = MINE
  else if (!gBoard[i][j].isMine && gBoard[i][j].isShown) {
    value = gBoard[i][j].minesAroundCount
    if (gBoard[i][j].minesAroundCount === 0) value = EMPTY
  }

  //update DOM:
  const elCell = document.querySelector(`.cell-${i}-${j}`)
  elCell.innerText = value
}

function cellMarked(elbtd, i, j) {

  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false
    gGame.markedCount--
    // gGame.shownCount--
  }
  else if (!gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = true
    gGame.markedCount++
    // gGame.shownCount--
  }

  // update Dom:
  var elTd = elbtd
  console.log('elTd: ', elTd)
  elTd.innerText = (gBoard[i][j].isMarked) ? FLEG : COVER
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

function revealNegs(board, posi, posj) {
  if (board[posi][posj].minesAroundCount === 0) {
    for (var i = posi - 1; i <= posi + 1; i++) {
      if (i < 0 || i >= board.length) continue
      for (var j = posj - 1; j <= posj + 1; j++) {
        if (j < 0 || j >= board[i].length) continue
        if (i === posi && j === posj) continue
        // if (board[i][j].isMarked === true) continue
        if (board[i][j].isShown) continue

        //UPDATE MODEL:
        board[i][j].isShown = true
        gGame.shownCount++
        if (gGame.shownCount === gLevel.size * gLevel.size - gLevel.mines) {
          if (checkWin()) winGame()
        }
      }
    }
  }
  //update DOM:
  renderBoard(gBoard)
}

function gameOver() {

  //reveal all mines
  console.log('gBoard :>> ', gBoard);
  for (var i = 0; i < gPosMines.length; i++) {
    var posI = gPosMines[i].i
    var posJ = gPosMines[i].j
    // console.log('posI :>> ', posI)
    // console.log('posJ :>> ', posJ)

    //update Model
    gBoard[posI][posJ].isShown = true
    //update DOM
    renderCell(posI, posJ)

    //stop timer
    stopTimer()

    // change smiley
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = LOSE

    //TO DO: unable onclick after lose
    gGame.isOn = false
    console.log(' gGame.isOn: ', gGame.isOn)
  }
}

function checkWin() {
  return (gGame.shownCount === gLevel.size * gLevel.size - gLevel.mines && gGame.markedCount === gLevel.mines)
}

function winGame() {
  // change smiley
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = WIN
}

//timer functions
function startTimer() {
  gTimerInterval = setInterval(() => {
    gGame.secsPassed++

    const elTimer = document.querySelector('.timer');
    elTimer.innerHTML = toHHMMSS('' + gGame.secsPassed);
  }, 1000);
}

function stopTimer() {
  clearInterval(gTimerInterval)
  gTimerInterval = null
}

function resetTimer() {
  clearInterval(gTimerInterval)
  gTimerInterval = null

  gGame.secsPassed = 0

  const elTimer = document.querySelector('.timer')
  elTimer.innerHTML = toHHMMSS('' + gGame.secsPassed)
}

function toHHMMSS(timeString) {
  var sec_num = parseInt(timeString, 10) // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - hours * 3600) / 60)
  var seconds = sec_num - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return minutes + ':' + seconds
}
