import Game from './game';

class SnakeUi {
  game = new Game(30);
  snakeTimer = '';
  across = 30;
  down = 30;
  gameSpeed = 120;
  
  constructor() {
    this.createGrid();
    this.addKeyboardEventListener();
    document.getElementById('messages').textContent = 'Press Spacebar to start/restart';
  }
  
  createGrid() {
    document.getElementById('root-div').innerHTML = '';
    for (var j = 0; j < this.across; j++) {
      var snakeRowElement = document.createElement('div');
      snakeRowElement.id = 'row' + j;
      snakeRowElement.classList.add('row-snake');
      document.getElementById('root-div').appendChild(snakeRowElement);

      for (var i = 0; i < this.down; i++) {
        var spaceElement = document.createElement('div');
        spaceElement.id = 'space' + i + "_" + j;
        spaceElement.classList.add('space');
        spaceElement.innerHTML = '&nbsp;'
        document.getElementById('row' + j).appendChild(spaceElement);
      }
    }
  }

  renderSnake() {
    for (var i = 0; i < this.across; i++) {
      for (var j = 0; j < this.down; j++) {
        var element = document.getElementById('space' + i + "_" + j);
        this.removeDirectionClasses(element);
        this.removeAppleClasses(element);
        this.removeSnakeHeadClasses(element);

        switch (this.game.board.board[i][j]) {
          case 'snake head':
            element.classList.remove('apple');
            element.classList.add('snake');
            element.classList.add('fa');
            element.classList.add('fa-2x');
            element.classList.add('fa-space-shuttle');
            element.classList.add(this.game.snake.direction);
            element.classList.add('snake-head');
            break;
          case 'snake':
            element.classList.remove('apple');
            element.classList.add('snake');
            break;
          case null:
            element.classList.remove('snake');
            element.classList.remove('apple');
            break;
          case 'apple':
            element.classList.add('apple');
            element.classList.add('fa');
            element.classList.add('fa-spin');
            element.classList.add('fa-2x');
            element.classList.add('fa-circle-o-notch');
            break;
        }
      }
    }
  }

  updatePoints() {
    document.getElementById('messages').textContent = 'Points: ' + this.game.points;
  }

  removeSnakeHeadClasses(element) {
    element.classList.remove('fa');
    element.classList.remove('fa-space-shuttle');
    element.classList.remove('snake-head');
    element.classList.add('fa-2x');
  }

  // prolly should just do a remove all classes and then add classes in a batch instead
  removeAppleClasses(element) {
    element.classList.remove('fa');
    element.classList.remove('fa-spin');
    element.classList.remove('fa-circle-o-notch');
    element.classList.add('fa-2x');
  }

  removeDirectionClasses(element) {
    element.classList.remove('left');
    element.classList.remove('right');
    element.classList.remove('down');
    element.classList.remove('up');
  }

  play() {
    this.game = new Game();
    this.createGrid();
    this.snakeTimer = window.setInterval(() => {
      this.game.step();

      if (this.game.snake.hitSelf() || this.game.snake.offBoard()) {
        clearInterval(this.snakeTimer);
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