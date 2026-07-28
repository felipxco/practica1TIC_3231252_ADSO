let board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let turn = 0; //0 user, 1 = pc

let gameActive = false;

startGame();

function endGame(message) {
  gameActive = false;
  document.querySelector("#player").textContent = message;
  document.querySelector("#restart-btn").style.display = "block";
}


document.querySelector("#restart-btn").addEventListener("click", () => {
  document.querySelector("#restart-btn").style.display = "none";
  startGame(); // <--- Esta línea es la que faltaba para reiniciar el juego
});

function renderBoard() {

  const html = board.map((row, rowIndex) => {
    const cells = row.map((cell, colIndex) => {
      return `<button class="cell" data-row="${rowIndex}" data-col="${colIndex}">${cell}</button>`;
    });
    return `<div class="row">${cells.join("")}</div>`;
  });
  document.querySelector("#board").innerHTML = html.join("");
  playerPlays();
}

function startGame() {

  board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  gameActive = true;
  turn = Math.random() <= 0.5 ? 0 : 1;

  renderBoard();
  renderPlayer();

  if (turn === 0) {
    playerPlays();
  } else {
    PCPlaysV2();
  }
}

function renderPlayer() {
  if (!gameActive) return;
  document.querySelector("#player").textContent = turn === 0 ? "Tu Turno (O)" : "Turno de la PC (X)";
}
function PCPlaysV2() {
  if (!gameActive) return;

  let availableMoves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        availableMoves.push({ row: i, col: j });
      }
    }
  }

  if (availableMoves.length > 0) {
    const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    board[move.row][move.col] = "X";

    turn = 0;
    renderBoard();
    renderPlayer();

    checkIfWinner();
  }
}
function playerPlays() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((buttonCell) => {
    buttonCell.addEventListener("click", (e) => {

      if (!gameActive || turn !== 0) return;

      const row = parseInt(e.target.getAttribute("data-row"));
      const col = parseInt(e.target.getAttribute("data-col"));


      if (board[row][col] === "") {
        board[row][col] = "O";
        turn = 1;

        renderBoard();

        const won = checkIfWinner(); // <--- AGREGA ESTA LÍNEA EXACTA

        if (won === "none") {

          setTimeout(() => {
            PCPlaysV2();
          }, 50);
        }
      }
    });
  });
}

function checkIfWinner() {
  const PCWon = [
    board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X",
    board[2][0] === "X" && board[1][1] === "X" && board[0][2] === "X",
    board[0][0] === "X" && board[1][0] === "X" && board[2][0] === "X",
    board[0][1] === "X" && board[1][1] === "X" && board[2][1] === "X",
    board[0][2] === "X" && board[1][2] === "X" && board[2][2] === "X",
    board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X",
    board[1][0] === "X" && board[1][1] === "X" && board[1][2] === "X",
    board[2][0] === "X" && board[2][1] === "X" && board[2][2] === "X",
  ];
  const playerWon = [
    board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O",
    board[2][0] === "O" && board[1][1] === "O" && board[0][2] === "O",
    board[0][0] === "O" && board[1][0] === "O" && board[2][0] === "O",
    board[0][1] === "O" && board[1][1] === "O" && board[2][1] === "O",
    board[0][2] === "O" && board[1][2] === "O" && board[2][2] === "O",
    board[0][0] === "O" && board[0][1] === "O" && board[0][2] === "O",
    board[1][0] === "O" && board[1][1] === "O" && board[1][2] === "O",
    board[2][0] === "O" && board[2][1] === "O" && board[2][2] === "O",
  ];

  if (PCWon.includes(true)) {
    endGame("¡La PC ha ganado!");
    return "pcwon";
  }
  if (playerWon.includes(true)) {
    endGame("¡Has ganado!");
    return "playerwon";
  }

  // Detectar empate: si no hay casillas vacías y nadie ganó
  const isTie = board.flat().every(cell => cell !== "");
  if (isTie) {
    endGame("¡Es un empate!");
    return "tie";
  }

  return "none";
}
