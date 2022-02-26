const nrRows = 20;
const nrCols = 20;
const nrBombs = 55;
const neighbors = [-1, 1, 20, -20, -19, 19, -21, 21];
let isOn = false;
let score = 0;
let nrFlags = nrBombs;
let flagId = 0;
let interval;
let milliSec = 1000;
let sec = 0;

function startGame() {
  if (isOn === false) {
    document.getElementById('board').innerText = '';
    isOn = true;
    let bombs = generateBombs();
    loadBoard(bombs);
    interval = setInterval(timer, milliSec);
  } else {
    clearInterval(interval);
    location.reload();
  }
}

function timer() {
  let time = document.getElementById('timer');
  ++sec;
  time.value = sec;
}

document.addEventListener('contextmenu', function(ev) {
  ev.preventDefault();
  let flag = document.getElementById(ev.target.id);
  if (ev.target.id > 0 && ev.target.id <= 400) {
    flag.classList.add('flag');
    --nrFlags;
    document.getElementById('nrFlags').value = nrFlags;
  }
}, false);

function generateBombs() {
  let bombs = [];
  const nrBoxes = nrRows * nrCols;
  let randomNr = generateRandomNumber(nrBoxes);
  for(let i = 1; i <= nrBombs; ++i) {
    while(bombs.includes(randomNr)) {
      randomNr = generateRandomNumber(nrBoxes);
    }
    bombs.push(randomNr);
  }
  return bombs;
}

function loadBoard(bombs) {
  let id = 0;
  //alert(bombs);
  for (let i = 0; i < nrRows; ++i) {
    for (let j = 0; j < nrCols; ++j) {
      ++id;
      let button = document.createElement('button');
      button.setAttribute('id', id);
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

function playGame(button) {
  if (button.classList.contains('flag')) {
    button.classList.remove('flag');
    ++nrFlags;
    document.getElementById('nrFlags').value = nrFlags;
  } else if (button.classList.contains('isBomb')) {
    gameOver(button.id);
  } else {
    ++score;
    checkForBombs(button);
  }
}

function checkForBombs(button) {
    let boxesToCheck = [button.id];
    let points = 0;
    while (boxesToCheck.length) {
      let currentButton = document.getElementById(boxesToCheck[0]);
      currentButton.disabled = true;
      currentButton.classList.add('buttonPressed');
      let number = getNrBombs(boxesToCheck[0]);
      if (number) {
        currentButton.innerText = number;
        const displayColor = getColor(number);
        currentButton.style.color = displayColor;
      } else {
        for (let i = 0; i < 8; ++i) {
          let idToCheck = isOnBoard(boxesToCheck[0], i);
          i = idToCheck[1];
          let thisButton = document.getElementById(idToCheck[0]);
          if (idToCheck[0] != -1 && !boxesToCheck.includes(idToCheck[0]) && !thisButton.classList.contains('buttonPressed') && !thisButton.classList.contains('flag')) {
            boxesToCheck.push(idToCheck[0]);
            ++points;
          }
        }
      }
      boxesToCheck.shift();
    }
    getScore(points);
}

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

function isOnBoard(id, i) {
  let idToCheck = Number(id) + Number(neighbors[i]);
  while (idToCheck < 1 || idToCheck > 400 || (id % nrRows === 0 && (i === 1 || i === 4 || i === 7)) || (id % nrRows === 1 && (i === 0 || i === 5 || i === 6)) || document.getElementById(idToCheck).classList.contains('buttonPressed')) {
    if (i < 7) {
      ++i;
      idToCheck = Number(id) + Number(neighbors[i]);
    } else {
      return [-1, i];
    }
  }
  return [idToCheck, i];
}

function getNrBombs(id) {
  let number = 0;
  for (let i = 0; i < 8; ++i) {
      let idToCheck = isOnBoard(id, i);
      i = idToCheck[1];
      if (idToCheck[0] != -1 && document.getElementById(idToCheck[0]).classList.contains('isBomb')) {
          ++number;
      }
  }
  return number;
}

function getScore(points) {
  score += points;
  document.getElementById('score').value = score;
  if (score === nrRows * nrCols - nrBombs) {
    gameWon();
  }
}

function gameWon() {
  document.getElementById('start').src = './images/gameWon.png';
  clearInterval(interval);
  alert('Congrats!');
}

function gameOver(id) {
  document.getElementById(id).classList.add('explodedBomb');
  document.getElementById('start').src = './images/gameOver.png';
  clearInterval(interval);
  alert('That was it!');
  revealBoard();
}

function revealBoard() {
  for (let i = 1; i <= 400; ++i) {
    let currentButton = document.getElementById(i);
    currentButton.disabled = true;
    if (currentButton.classList.contains('isBomb') && !currentButton.classList.contains('explodedBomb')) {
      currentButton.classList.add('showBomb');
    } else {
      let number = getNrBombs(i);
      currentButton.innerText = number;
      const displayColor = getColor(number);
      currentButton.style.color = displayColor;
      currentButton.classList.add('buttonPressed');
    }
  }
}

function generateRandomNumber(n) {
  return Math.floor(Math.random() * n + 1);
}
