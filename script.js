const board = document.querySelector(".board");
const checkBtn = document.querySelector(".check-btn");
const dialPad = document.querySelector(".dial-pad");
let selectedCell = null;
let playboard = [];
let solutionBoard = [];

async function fetchBoard(difficulty) {
  try {
    const response = await fetch(
      `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution,difficulty}}}`
    );
    const data = await response.json();
    playboard = [...data.newboard.grids[0].value];
    solutionBoard = [...data.newboard.grids[0].solution];
    console.log(data.newboard.grids[0].difficulty);
    console.log(solutionBoard);
    
    return data.newboard.grids[0].value;
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchBoard("easy").then((gameBoard) => {
  for (let i = 0; i < gameBoard.length; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < gameBoard[i].length; j++) {
      const cell = document.createElement("td");
      cell.setAttribute("data-row", `${i}`);
      cell.setAttribute("data-col", `${j}`);
      if (gameBoard[i][j] === 0) {
        cell.textContent = "";
        cell.classList.add("editable");
      } else {
        cell.textContent = gameBoard[i][j];
        cell.style.backgroundColor = "rgb(230, 230, 230)";
      }
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
});

board.addEventListener("click", (event) => {
  if (
    event.target.tagName === "TD" &&
    event.target.classList.contains("editable")
  ) {
    if (selectedCell) {
      selectedCell.classList.remove("selected");
      selectedCell.contentEditable = false;
    }
    selectedCell = event.target;
    selectedCell.classList.add("selected");
    selectedCell.contentEditable = true;
    selectedCell.focus();    
    
    // remove previous selection
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = board.querySelector("td[data-row=\""+`${i}`+"\"][data-col=\""+`${j}`+"\"]");
        cell.style.backgroundColor = "white";
      }
    }
    
    const rowLine = board.querySelectorAll("td[data-row=\""+`${selectedCell.getAttribute('data-row')}`+"\"]");
    const colLine = board.querySelectorAll("td[data-col=\""+`${selectedCell.getAttribute('data-col')}`+"\"]");
    rowLine.forEach(cell => {
      console.log(cell.style.backgroundColor);
      if (cell.style.backgroundColor != "rgb(rgb(230, 230, 230))") {
        cell.style.backgroundColor = "rgb(252, 252, 204)";
      }
    });
    colLine.forEach(cell => {
      if (cell.style.backgroundColor != "rgb(230, 230, 230)") {
        cell.style.backgroundColor = "rgb(252, 252, 204)";
      }
    });
  }
});

board.addEventListener("keydown", (event) => {
  if (selectedCell && event.key >= "1" && event.key <= "9") {
    event.preventDefault();
    selectedCell.textContent = event.key;
    playboard[selectedCell.getAttribute("data-row")][
      selectedCell.getAttribute("data-col")
    ] = Number(event.key);
    selectedCell.classList.remove("selected");
    selectedCell.contentEditable = false;
    selectedCell = null;
  }
});

dialPad.addEventListener("click", (event) => {
  if (selectedCell && event.target.tagName === "BUTTON") {
    selectedCell.textContent = event.target.textContent;
    playboard[selectedCell.getAttribute("data-row")][
      selectedCell.getAttribute("data-col")
    ] = Number(event.target.textContent);
    console.log(`Play Board is ${playboard}`);
    selectedCell.classList.remove("selected");
    selectedCell = null;
  }
});

checkBtn.addEventListener("click", () => {
  let correct = true;
  if (playboard.length != solutionBoard.length) {
    correct = false;
  } else {
    for (let i = 0; i < playboard.length; i++) {
      if (playboard[i] !== solutionBoard[i]) {
        correct = false;
        break;
      }
    }
  }

  if (correct) {
    console.log("Hurray!");
  } else {
    console.log("You Lost!");
  }
  console.log(playboard)
});
