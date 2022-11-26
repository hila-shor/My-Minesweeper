
//GAME SETTING

//Level
function onUpdateLevel(size, mines, elbtn) {
  gLevel.size = size
  gLevel.mines = mines
  //update g-variable witch level the player is playing
  if (elbtn.innerText === 'Medium') gIsLevel.isMedium = true
  else if (elbtn.innerText === 'Beginner') gIsLevel.isBeginner = true
  else if (elbtn.innerText === 'Expert') gIsLevel.isExpert = true

  onInitGame()

}
// function onLevelStyle(elLev) {

//   console.log(elLev)
// }
//Set mines and neighbors count around
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

//Build and render 
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
function renderBoard(board) {

  var strHTML = '<table> <tbody>'
  for (var i = 0; i < board.length; i++) {

    strHTML += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      var currCell = gBoard[i][j]
      var cell = ''
      if (!currCell.isShown && !currCell.isMarked) cell = COVER
      else if (currCell.isMine && currCell.isShown && !currCell.isMarked) cell = MINE
      else if (currCell.isMarked) cell = FLAG
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
function renderCell(i, j) {

  //update model
  var value
  if (gBoard[i][j].isMine) value = MINE
  if (!gBoard[i][j].isShown) {
    value = COVER
  }

  if (gBoard[i][j].isMarked) value = FLAG
  else if (!gBoard[i][j].isMine && gBoard[i][j].isShown) {
    value = gBoard[i][j].minesAroundCount
    if (gBoard[i][j].minesAroundCount === 0) value = EMPTY
  }

  //update DOM:
  const elCell = document.querySelector(`.cell-${i}-${j}`)
  elCell.innerText = value
}

//Timer functions
function startTimer() {
  gTimerInterval = setInterval(() => {
    gGame.secsPassed++

    const elTimer = document.querySelector('.timer');
    elTimer.innerHTML = toHHMMSS('' + gGame.secsPassed);
  }, 1000);
}
function stopTimer() { //when win or lose 
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

function getBestGameTime() {
  console.log('from best time :>> ');
  //check best game time for beginners
  var currTimer = document.querySelector('.timer').innerText
  //save the split result 
  var min = +currTimer.split(':')[0]
  var sec = +currTimer.split(':')[1]
  console.log('min :>> ', min);
  console.log('sec :>> ', sec);
  //check the best game time and update the g-variable
  if (min < gBestGameTime.min) {
    gBestGameTime.min = min
    gBestGameTime.sec = sec
  }
  // }else{
  //   gBestGameTime.min=  gBestGameTime.min
  //   gBestGameTime.sec= gBestGameTime.sec
  // }

  if (min === gBestGameTime.min && sec < gBestGameTime.sec) {
    gBestGameTime.min = min
    gBestGameTime.sec = sec
  }
  console.log(gBestGameTime)
}