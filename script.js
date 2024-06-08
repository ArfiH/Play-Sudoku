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
});
