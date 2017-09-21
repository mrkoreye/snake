import Game from './game';

class SnakeUi {
  game = null;
  snakeTimer = null;
  boardSize = 30;
  gameSpeed = 120;
  
  constructor() {
    this.createGrid();
    this.addKeyboardEventListener();
    document.getElementById('messages').textContent = 'Press Spacebar to start/restart';
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
          case null:
            element.className = `space`;
            break;
          case 'apple':
            element.className = `apple space`
            break;
        }
      }
    }
  }

  updatePoints() {
    document.getElementById('messages').textContent = 'Points: ' + this.game.points;
  }

  gameOver() {
    document.getElementById('messages').textContent = 'Ooops, game over. Points: ' + this.game.points;
  }

  play() {
    this.game = new Game(this.boardSize);
    this.createGrid();
    this.snakeTimer = window.setInterval(() => {
      this.game.step();

      if (this.game.snake.hitSelf() || this.game.snake.offBoard()) {
        clearInterval(this.snakeTimer);
        this.gameOver();
      } else {
        this.renderSnake(); 
        this.updatePoints();
      }
    }, this.gameSpeed);
  }; 
  
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
};

export default SnakeUi;