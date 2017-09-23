import Game from './game';
import Music from './music'

class SnakeUi {
  game = null;
  snakeTimer = null;
  boardSize = 30;
  gameSpeed = 120;
  music = null;
  
  constructor() {
    this.createGrid();
    this.addEventListeners();
    this.music = new Music()
    this.showInstructions();
  }
  
  createGrid() {
    document.getElementById('root-div').innerHTML = '';
    for (var j = 0; j < this.boardSize; j++) {
      var snakeRowElement = document.createElement('div');
      snakeRowElement.id = 'row' + j;
      snakeRowElement.classList.add('row-snake');
      document.getElementById('root-div').appendChild(snakeRowElement);

      for (var i = 0; i < this.boardSize; i++) {
        var spaceElement = document.createElement('div');
        spaceElement.id = 'space' + i + "_" + j;
        spaceElement.classList.add('space');
        spaceElement.innerHTML = '&nbsp;'
        document.getElementById('row' + j).appendChild(spaceElement);
      }
    }
  }

  renderSnake() {
    for (var i = 0; i < this.boardSize; i++) {
      for (var j = 0; j < this.boardSize; j++) {
        var element = document.getElementById('space' + i + "_" + j);
        
        switch (this.game.board.board[i][j]) {
          case 'snake head':
            element.className = `${this.game.snake.direction} snake-head snake space`;
            break;
          case 'snake':
            element.className = `snake space`;
            break;
          case 'apple':
            element.className = `apple space`
            break;
          case 'paper':
            element.className = `paper space`
            break;
          default:
            element.className = `space`;
            break;
        }
      }
    }
  }

  showInstructions() {
    document.getElementById('instructions').classList.add('show');
  }

  hideInstructions() {
    document.getElementById('instructions').classList.remove('show');
  }

  showGameOverMessage() {
    document.getElementById('game-over-message').classList.add('show');
  }

  hideGameOverMessage() {
    document.getElementById('game-over-message').classList.remove('show');
  }

  updatePoints() {
    document.getElementById('messages').textContent = 'Points: ' + this.game.points;
  }

  play() {
    this.game = new Game(this.boardSize, this.music);
    this.createGrid();
    this.hideInstructions();
    this.hideGameOverMessage();
    this.snakeTimer = window.setInterval(() => {
      this.game.step();

      if (this.game.snake.hitSelf() || this.game.snake.offBoard()) {
        clearInterval(this.snakeTimer);
        this.showGameOverMessage();
      } else {
        this.renderSnake(); 
        this.updatePoints();
      }
    }, this.gameSpeed);
  };
  
  addEventListeners() {
    this.addKeyboardEventListener();
    this.addPlayButtonListener();
    this.addStopButtonListener();
  }
  
  addKeyboardEventListener() {
    document.addEventListener('keydown', (e) => {
      var keyCode = e.keyCode;
  
      if([32, 37, 38, 39, 40].indexOf(keyCode) > -1) {
        e.preventDefault();
      }
  
      switch (keyCode) {
        // Spacebar
        case 32:
          if (this.snakeTimer) {
            clearInterval(this.snakeTimer);
          }
          this.play();
        case 37:
          this.game.snake.turn('left');
          break;
        case 38:
          this.game.snake.turn('up');
          break;
        case 39:
          this.game.snake.turn('right');
          break;
        case 40:
          this.game.snake.turn('down');
          break;
      }
    });
  }

  addPlayButtonListener() {
    document.getElementById('play-button').addEventListener('click', (e) => {
      this.music.playProgress();
    });
  }

  addStopButtonListener() {
    document.getElementById('stop-button').addEventListener('click', (e) => {
      this.music.stopAllSounds();
    });
  }
};

export default SnakeUi;