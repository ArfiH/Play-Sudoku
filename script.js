const board = document.querySelector(".board");
const checkBtn = document.querySelector(".check-btn");
const dialPad = document.querySelector(".dial-pad");
let selectedCell = null;
let playboard = [];
let solutionBoard = [];
const grayColor = "rgb(180, 180, 180)";
const selectedGroupColor = "rgb(205, 205, 205)";

function encodeParams(params) {
  const data = [];
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((val, i) => {
        data.push(`${encodeURIComponent(key)}[${i}]=${encodeURIComponent(val)}`);
      });
    } else {
      data.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return data.join('&');
}

async function fetchSolution(board) {
  try {
    const response = await fetch('https://sugoku.onrender.com/solve', {
      method: 'POST',
      body: encodeParams({ board }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await response.json();
    console.log(data.solution);
    return data.solution;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchBoard(difficulty) {
  try {
    const response = await fetch(
      `https://sugoku.onrender.com/board?difficulty=${difficulty}`
    );
    const data = await response.json();
    playboard = data.board;
    return data.board;
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
        cell.style.backgroundColor = grayColor;
      }
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
});

fetchSolution(playboard).then(solution => {
    solutionBoard = [...solution];
  });

board.addEventListener("click", (event) => {
  if (
    event.target.tagName === "TD" &&
    event.target.classList.contains("editable")
  ) {
    if (selectedCell) {
      selectedCell.classList.remove("selected");
      selectedCell.style.border = "none";
      selectedCell.contentEditable = false;
    }
    selectedCell = event.target;
    selectedCell.classList.add("selected");
    selectedCell.contentEditable = true;
    selectedCell.style.border = "2px solid black";
    // selectedCell.focus();    
    
    // remove previous selection
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = board.querySelector("td[data-row=\""+`${i}`+"\"][data-col=\""+`${j}`+"\"]");
        cell.style.backgroundColor = "white";
        if (!cell.classList.contains("editable")) {
          cell.style.backgroundColor = grayColor;
        }
      }
    }
    
    const rowLine = board.querySelectorAll("td[data-row=\""+`${selectedCell.getAttribute('data-row')}`+"\"]");
    const colLine = board.querySelectorAll("td[data-col=\""+`${selectedCell.getAttribute('data-col')}`+"\"]");
    rowLine.forEach(cell => {
      cell.style.backgroundColor = selectedGroupColor;
      if (!cell.classList.contains("editable")) {
        cell.style.backgroundColor = grayColor;
      }
    });
    colLine.forEach(cell => {
      cell.style.backgroundColor = selectedGroupColor;
      if (!cell.classList.contains("editable")) {
        cell.style.backgroundColor = grayColor;
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
    console.log("You won!");
    document.querySelector('.status').innerHTML = "You Won!";
  } else {
    console.log("You Lost!");
    document.querySelector('.status').innerHTML = "Incorrect!<br>Try again";
  }
  console.log(playboard)
});
