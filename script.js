const dir = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
const game = {
   nrRows: 20,
   nrCols: 20,
   nrBombs: 55,
   isOn: false,
   score: 0,
   nrFlags: 55,
   interval: 0,
   milliSec: 1000,
   sec: 0,
};

//function called when the smiley face is clicked
function startGame() {
  if (game.isOn === false) { //if the game has not started, it starts the game
    document.getElementById('board').innerText = '';
    game.isOn = true;
    let bombs = generateBombs();
    loadBoard(bombs);
    game.interval = setInterval(timer, game.milliSec);
  } else { //if the games has started already, it restarts the game
    clearInterval(game.interval);
    location.reload();
  }
}

//function counting the seconds since the game started
function timer() {
  let time = document.getElementById('timer');
  ++game.sec;
  time.value = game.sec;
}

//when clicking right with the mouse, it sets a flag in the box
document.addEventListener('contextmenu', function(ev) {
  ev.preventDefault();
  let flag = document.getElementById(ev.target.id);
  if (flag.classList.contains('button') && !flag.classList.contains('flag')) {
    flag.classList.add('flag');
    --game.nrFlags;
    document.getElementById('nrFlags').value = game.nrFlags;
  }
}, false);

//function used to generate the bombs ids array
function generateBombs() {
  let bombs = [];
  const nrBoxes = game.nrRows * game.nrCols;
  let randomNr = generateRandomNumber(nrBoxes);
  for(let i = 1; i <= game.nrBombs; ++i) {
    while(bombs.includes(randomNr)) {
      randomNr = generateRandomNumber(nrBoxes);
    }
    bombs.push(randomNr);
  }
  return bombs;
}

//function called when game starts to display the game board
function loadBoard(bombs) {
  let id = 0;
  for (let i = 0; i < game.nrRows; ++i) {
    for (let j = 0; j < game.nrCols; ++j) {
      ++id;
      let button = document.createElement('button');
      button.id = [i, j];
      if (bombs.includes(id)) {
        button.classList.add('isBomb');
      }
      button.classList.add('button');
      button.onclick = function() {
        playGame(button);
      };
      document.getElementById('board').appendChild(button);
    }
  }
}

//function called when a button is clicked
function playGame(button) {
  if (button.classList.contains('flag')) {
    button.classList.remove('flag');
    ++game.nrFlags;
    document.getElementById('nrFlags').value = game.nrFlags;
  } else if (button.classList.contains('isBomb')) {
    gameOver(button.id);
  } else {
    ++game.score;
    checkForBombs(button);
    getScore();
  }
}

//function that checks if there are bombs around the pressed button and its neighbors
function checkForBombs(button) {
    const currentId = button.id.match(/\d+/g);
    document.getElementById(button.id).classList.add('buttonPressed');
    let boxesToCheck = [];
    boxesToCheck.push(currentId);
    while (boxesToCheck.length) {
      let currentButton = document.getElementById(boxesToCheck[0]);
      currentButton.disabled = true;
      let number = getNrBombs(boxesToCheck[0]);
      if (number) {
        currentButton.innerText = number;
        currentButton.style.color = getColor(number);
      } else {
        for (let neighbor of dir) {
          let idToCheck = isOnBoard(boxesToCheck[0], neighbor);
          let thisButton = document.getElementById(idToCheck);
          if (idToCheck != -1 && !thisButton.classList.contains('buttonPressed') && !thisButton.classList.contains('flag')) {
            boxesToCheck.push(idToCheck);
            thisButton.classList.add('buttonPressed');
            ++game.score;
          }
        }
      }
      boxesToCheck.shift();
    }
}

//function to get the text color to display the number of bombs
function getColor(number) {
  const numberColor = [[1, 'blue'], [2, 'green'], [3, 'red'], [4, 'purple'], [5, 'maroon'], [6, 'turquoise'], [7, 'black'], [8, 'grey']];
  let color;
  for(let col of numberColor) {
    if (col[0] === number) {
      color = col[1];
    }
  }
  return color;
}

//function that calculates the number of neighboring boxes with bomb
function getNrBombs(id) {
  let number = 0;
  for (let neighbor of dir) {
      let idToCheck = isOnBoard(id, neighbor);
      if (idToCheck != -1 && document.getElementById(idToCheck).classList.contains('isBomb')) {
          ++number;
      }
  }
  return number;
}

//cheks if box is on the gameboard
function isOnBoard(id, neighbor) {
  let x = getCoord(id[0], neighbor[0]);
  let y = getCoord(id[1], neighbor[1]);
  let idToCheck = [];
  idToCheck.push(x);
  idToCheck.push(y);
  if (x < 0 || x > 19 || y < 0 || y > 19) {
    return -1;
  }
  return idToCheck;
}

function getCoord(x, y) {
  const coord = Number(x) + Number(y);
  return coord;
}

//function that diplays the score
function getScore() {
  document.getElementById('score').value = game.score;
  if (game.score === game.nrRows * game.nrCols - game.nrBombs) {
    gameWon();
  }
}

//function called when the game is won
function gameWon() {
  document.getElementById('start').src = './images/gameWon.png';
  clearInterval(game.interval);
  alert('Congrats!');
}

//function called when game is lost
function gameOver(id) {
  document.getElementById(id).classList.add('explodedBomb');
  document.getElementById('start').src = './images/gameOver.png';
  clearInterval(game.interval);
  alert('That was it!');
  revealBoard();
}

//function that reveals the board
function revealBoard() {
  for (let i = 0; i < game.nrRows; ++i) {
    for (let j = 0; j < game.nrCols; ++j) {
      const id = [i, j];
      let currentButton = document.getElementById(id);
      currentButton.disabled = true;
      if (currentButton.classList.contains('isBomb') && !currentButton.classList.contains('explodedBomb')) {
        currentButton.classList.add('showBomb');
      } else {
        let number = getNrBombs(id);
        currentButton.innerText = number;
        currentButton.style.color = getColor(number);
        currentButton.classList.add('buttonPressed');
      }
    }
  }
}

//function that returns a random number
function generateRandomNumber(n) {
  return Math.floor(Math.random() * n + 1);
}
