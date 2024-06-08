const board = document.querySelector('.board');

async function fetchBoard(difficulty) {
  try {
    const response = await fetch(
      `https://sugoku.onrender.com/board?difficulty=${difficulty}`
    );
    const data = await response.json();
    const array = data.board;
    return array;
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchBoard("easy").then((gameBoard) => {
  console.log(gameBoard);

  for (let i = 0; i < gameBoard.length; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < gameBoard[i].length; j++) {
      const cell = document.createElement('td');
      cell.textContent = gameBoard[i][j] === 0 ? '' : gameBoard[i][j];
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
});
