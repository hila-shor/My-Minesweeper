
//TO DO: unable oncellclic/ onmouseup after lose - unreveal  close cells after gameover

//TO DO: first click no mine
//TO DO:  

// icons

const NORMAL = '🤓'
const LOSE = '😖'
const WIN = '💪'
const FLAG = '🚩'
const MINE = '💣'
const EMPTY = ' '
const COVER = '-'

//global vairiable
var gBoard
var gPosMines = []
const gLevel = {
  size: 4,
  mines: 4
}
const gLevels = [{ size: 4, mines: 4 }, { size: 8, mines: 14 }, { size: 12, mines: 32 },]
const gIsLevel = {
  isBeginner: true,
  isMedium: false,
  isExpert: false
}
const gBestGameTime = {
  min: Infinity,
  sec: Infinity
}

const gGame = {
  isOn: true,
  notMineShownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  clickcount: 0,
  isMinesRender: false,
  livesCounter: 3,
  isHint: false,
  hintsCounter: 3,
  bestGameTime: { min: 0, sec: 0 }
}


//timer globals
var gTimerInterval = null


//PLAY THE GAME

function onInitGame() {
  console.log('gBestGameTime: ', gBestGameTime)
  gIsLevel.isBeginner = true
  gGame.isOn = true
  gGame.clickcount = 0
  gGame.notMineShownCount = 0
  gGame.markedCount = 0
  gGame.isMinesRender = false
  gGame.livesCounter = 3
  gGame.isHint = false
  gGame.hintsCounter = 3
  gPosMines = []

  resetTimer()
  gBoard = buildBoard()
  console.log(gBoard)
  renderBoard(gBoard)
  console.log('gBoard after negs update : ', gBoard)
  console.log(gBoard)
  setLives()
  setHint()
  // change smiley
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = NORMAL
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
function cellMarked(elbtd, i, j) {

  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false
    gGame.markedCount--

  }
  else if (!gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = true
    gGame.markedCount++

  }

  // Update Dom:
  var elTd = elbtd
  console.log('elTd: ', elTd)
  elTd.innerText = (gBoard[i][j].isMarked) ? FLAG : COVER
}
function onCellClicked(elCell, i, j) {

  if (!gGame.isMinesRender) {
    getMinesRandLocation(i, j)
    setMinesNegsCount(gBoard)
  }

  if (!gGame.isOn) return

  if (gBoard[i][j].isShown) return
  console.log(gGame.clickcount)

  //hint
  if (gGame.isHint) {
    hintRevealNegs(gBoard, i, j)
    gGame.notMineShownCount--
  }

  //UPDATE MODEL:
  gBoard[i][j].isShown = true
  if (!gBoard[i][j].isMine) gGame.notMineShownCount++

  console.log(gGame.notMineShownCount)

  //lives management
  if (gBoard[i][j].isMine) {
    // gGame.notMineShownCount--
    gGame.livesCounter--
    setLives()
    if (checkGameOver()) gameOver()
  }

  // when there is enough open cells check win
  if (gGame.notMineShownCount === gLevel.size * gLevel.size - gLevel.mines) {
    if (checkWin()) winGame()
  }
  //if cell has no mine neighbor expend and update cells around him
  if (gBoard[i][j].minesAroundCount === 0) {
    expandShown(gBoard, i, j)
    console.log(gGame.notMineShownCount)
  }
  //UPDATE DOM:
  renderCell(i, j)
}

//Hints
function getHintHTML() {
  return '<p onclick="onUseHint(this)">💡</p>'
}
function setHint() {
  var elHint = document.querySelector('.hint')
  var HTML = ''
  for (var i = 0; i < gGame.hintsCounter; i++) {

    HTML += getHintHTML()
  }
  elHint.innerHTML = HTML
}
function onUseHint(elhint) {
  gGame.isHint = true
  gGame.hintsCounter--
  elhint.innerText = '⌛'
}
function hintRevealNegs(board, posi, posj) {
  var hintPositions = []
  for (var i = posi - 1; i <= posi + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = posj - 1; j <= posj + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      // if (i === posi && j === posj) continue
      //I want to reveal that cell- that's why I dropped the condition of the cell itself
      // if (board[i][j].isMarked === true) continue 
      if (board[i][j].isShown) continue

      //UPDATE MODEL:
      board[i][j].isShown = true
      hintPositions.push({ i, j })
      console.log('hints: ', hintPositions)
    }
  }
  //update DOM:
  renderBoard(gBoard)

  //close cells
  setTimeout(hintHideNegs, 1000, hintPositions)

}
function hintHideNegs(shownpos) {
  for (var i = 0; i < shownpos.length; i++) {
    var locI = shownpos[i].i
    var locJ = shownpos[i].j
    gBoard[locI][locJ].isShown = false
  }
  gGame.isHint = false
  console.log('in the timeout hint')
  renderBoard(gBoard)
  setHint()
  console.log(gGame.isHint)
}

//Lives 
function getLivesHTML() {
  return '<p>❤️</p>'
}

function setLives() {
  var elLives = document.querySelector('.lives')
  var HTML = ''
  for (var i = 0; i < gGame.livesCounter; i++) {

    HTML += getLivesHTML()
  }
  elLives.innerHTML = HTML
}
function expandShown(board, posi, posj) { // more option for argument- elcell
  if (board[posi][posj].minesAroundCount === 0) {
    for (var i = posi - 1; i <= posi + 1; i++) {
      if (i < 0 || i >= board.length) continue
      for (var j = posj - 1; j <= posj + 1; j++) {
        if (j < 0 || j >= board[i].length) continue
        if (i === posi && j === posj) continue
        //I want to count that cell- that's why I dropped the condition of the cell itself
        // if (board[i][j].isMarked === true) continue 
        if (board[i][j].isShown) continue

        //UPDATE MODEL:
        board[i][j].isShown = true
        gGame.notMineShownCount++
        if (gGame.notMineShownCount === gLevel.size * gLevel.size - gLevel.mines) {
          if (checkWin()) winGame()
        }
      }
    }
  }
  //update DOM:
  renderBoard(gBoard)
}

// Win
function checkWin() {
  return (gGame.notMineShownCount === gLevel.size * gLevel.size - gLevel.mines && gGame.markedCount >= gLevel.mines - 3)
}
function winGame() {
  // change smiley
  var elSmiley = document.querySelector('.smiley')
  elSmiley.innerText = WIN

  //stop the timer update best game time
  stopTimer()
  getBestGameTime()


  //unable onclick after a loss
  gGame.isOn = false
}


//Lose
function checkGameOver(posi, posj) {
  return (gGame.livesCounter === 0)
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

    //unable onclick after a loss
    gGame.isOn = false
    console.log(' gGame.isOn: ', gGame.isOn)
  }
}

