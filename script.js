const board = document.querySelector(".board");
const checkBtn = document.querySelector(".check-btn");
const helpBtn = document.querySelector(".help-btn");
const dialPad = document.querySelector(".dial-pad");
let selectedCell = null;
let playboard = [];
let solutionBoard = [];
const grayColor = "rgb(180, 180, 180)";
const selectedGroupColor = "rgb(205, 205, 205)";

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

async function initGame(difficulty) {
  // reset board and solution and game status
  selectedCell = null;
  playboard = [];
  solutionBoard = [];
  board.innerHTML = '';
  
  await fetchBoard(difficulty).then((gameBoard) => {
    displayBoard(gameBoard);
  });
}

function displayBoard(gameBoard) {
  board.innerHTML = '';
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
}

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
    //selectedCell.focus();    
    //selectedCell.tabIndex = 0;
    
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
    
    if (event.target.textContent === 'Clear') {
      selectedCell.textContent = '';
      playboard[selectedCell.getAttribute("data-row")][
        selectedCell.getAttribute("data-col")
      ] = 0;
    }
    else {
      selectedCell.textContent = event.target.textContent;
      playboard[selectedCell.getAttribute("data-row")][
        selectedCell.getAttribute("data-col")
      ] = Number(event.target.textContent);
    }
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
    for (let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
          if (playboard[i][j] !== solutionBoard[i][j]) {
            correct = false;
            break;
          }
        }
    }
  }

  if (correct) {
    console.log("You won!");
    document.querySelector('.status').innerHTML = "You Won!";
  } else {
    console.log("You Lost!");
    document.querySelector('.status').innerHTML = 'Incorrect!<br>Try again';
    setTimeout(() => {
      document.querySelector('.status').innerHTML =     "";
    }, 1000);
  }
  console.log(playboard)
});

helpBtn.addEventListener('click', event => {
  let diff = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (playboard[i][j] !== solutionBoard[i][j]) {
        diff.push({row: i, col: j, val: solutionBoard[i][j]});
      }
    }
  }
  let randomIndex = Math.floor(Math.random()*diff.length);
  let reveal = diff.splice(randomIndex, 1);
  console.log(reveal);
 
  selectedCell = board.querySelector("td[data-row=\"" + `${reveal[0].row}` + "\"][data-col=\"" + `${reveal[0].col}` + "\"]");
  selectedCell.textContent = reveal[0].val;
  playboard[selectedCell.getAttribute("data-row")][
        selectedCell.getAttribute("data-col")
      ] = reveal[0].val;
});

initGame("easy");