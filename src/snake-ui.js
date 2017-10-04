import Game from './game';
import Music from './music'

class SnakeUi {
  game = null;
  snakeTimer = null;
  boardSize = 30;
  gameSpeed = 140;
  music = null;
  clickEventType = 'click';
  
  constructor() {
    this.clickEventType = this.getClickEventType();
    this.music = new Music();
    this.createGrid();
    this.showInstructions();
    this.updatePoints();
    this.addEventListeners();
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
    const message = `Points: ${this.game && this.game.points || 0}, Progress: ${this.music.percentProgressThroughPiece() || '0%'}`;
    document.getElementById('messages').textContent = message;
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

  startGame() {
    if (this.snakeTimer) {
      clearInterval(this.snakeTimer);
    }
    this.music.playNotes(['G3-Bb3-D3-a-t2']);
    this.play();
  }
  
  addEventListeners() {
    this.addKeyboardEventListener();
    this.addEventListenerById('play-button', () => this.music.playProgress());
    this.addEventListenerById('stop-button', () => this.music.stopAllSounds());
    this.addEventListenerById('start-game', () => this.startGame());

    ['up', 'right', 'down', 'left'].forEach((direction) => {
      const elementId = `move-${direction}`;
      const isMobile = this.clickEventType === 'touchstart';
      this.addEventListenerById(elementId, () => {
        if (this.game) {
          this.game.snake.turn(direction);
        }

        if (isMobile) {
          const element = document.getElementById(elementId);
          element.classList.add('active');
        }
      });

      if (isMobile) {
        this.addEventListenerById(elementId, () => {
          const element = document.getElementById(elementId);
          element.classList.remove('active');
        }, 'touchend');
      }
    });
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
          this.startGame();
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

  addEventListenerById(elementId, callback, clickEventType = this.clickEventType) {
    document.getElementById(elementId).addEventListener(clickEventType, (e) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
    });
  }

  getClickEventType() {
    if ('ontouchstart' in document.documentElement === true) {
      return 'touchstart';
    } else {
      return 'click';
    }
  }
};

export default SnakeUi;