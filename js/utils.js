function renderBoard(mat, selector) {

  var strHTML = '<table border="0"><tbody>'
  for (var i = 0; i < mat.length; i++) {

    strHTML += '<tr>'
    for (var j = 0; j < mat[0].length; j++) {

      const cell = mat[i][j]
      const className = `cell cell-${i}-${j}`

      strHTML += `<td class="${className}">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function countNeighbors(cellI, cellJ, board) {
  var negsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].gameElement === BALL) negsCount++;
    }
  }
  return negsCount;
}

// function shuffle(items) {
//   var randIdx, keep, i;
//   for (i = items.length - 1; i > 0; i--) {
//     randIdx = getRandomInt(0, items.length - 1);

//     keep = items[i];
//     items[i] = items[randIdx];
//     items[randIdx] = keep;
//   }
//   return items;
// }

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

////// draft//////////

// function getMineCells(board) {
//   console.log('in getMineCells ')
//   gMineCells = []
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[i].length; j++) {
//       if (board[i][j].isMine) {
//         gMineCells.push({ i, j })
//       }
//     }
//   }
//   return gMineCells
// }