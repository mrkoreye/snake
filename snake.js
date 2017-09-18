window.Snakey = {
	boardSize: 30
};

Snakey.Snake = (function () {
	function Snake () {
		this.snake = [[5, 5], [5, 6], [5, 7], [5, 8], [5, 9]];
		this.head = this.snake[this.snake.length - 1];
		this.direction = 'down';
	}
	
	Snake.prototype.turn = function(direction) {
		switch(direction) {
			case 'left':
				if(!(this.direction == 'right')) {
					this.direction = direction;
				}
				break;
			case 'right':
				if(!(this.direction == 'left')) {
					this.direction = direction;
				}
				break;
			case 'up':
				if(!(this.direction == 'down')) {
					this.direction = direction;
				}
				break;
			case 'down':
				if(!(this.direction == 'up')) {
					this.direction = direction;
				}
				break;
		}
	}
	
	Snake.prototype.step = function() {
		var newHead = [];
		
		switch(this.direction) {
			case 'up':
				newHead[0] = this.head[0] - 1;
				newHead[1] = this.head[1];
				this.changeSnake(newHead);
				break;
			case 'down':
				newHead[0] = this.head[0] + 1;
				newHead[1] = this.head[1];
				this.changeSnake(newHead);
				break;
			case 'left':
				newHead[0] = this.head[0];
				newHead[1] = this.head[1] - 1;
				this.changeSnake(newHead);
				break;
			case 'right':
				newHead[0] = this.head[0];
				newHead[1] = this.head[1] + 1;
				this.changeSnake(newHead);
				break;
			default:
				//should never get here...
		}
	}
	
	Snake.prototype.changeSnake = function(newHead) {
		this.snake.push(newHead);
		this.snake.shift();
		this.head = this.snake[this.snake.length - 1];
	}
	
	Snake.prototype.offBoard = function () {
		var overMax = (this.head[0] >= Snakey.boardSize) || (this.head[1] >= Snakey.boardSize);
		var underMin = (this.head[0] < 0) || (this.head[1] < 0);

		if (overMax || underMin) {
			return true;
		} else {
			return false;
		}
	}
		
	Snake.prototype.embiggenSnake = function () {
		var endOfSnake = this.snake[0];
		for (var i = 0; i < 2; i++) {
			this.snake.unshift([endOfSnake[0] + i + 1, endOfSnake[1]]);
		}
	}
	
	Snake.prototype.hitSelf = function () {
		for (var i = 0, len = this.snake.length; i < (len - 1); i++){
			if (this.head.toString() === this.snake[i].toString()) {
				return true;
			} 
		}
		return false;	
	}
	
	return Snake
})();

Snakey.Board = (function () {
	function Board () {
		this.board = createBoard();
	}
	
	Board.prototype.update = function(snake) {
		this.clearBoard();
		for (var i = 0, len = snake.snake.length; i < len; i ++) {
			var row = snake.snake[i][0];
			var col = snake.snake[i][1];
			if (this.board[row]) {
				this.board[row][col] = 'snake';
			}
		}
	}
	
	function createBoard () {
		var board = [];
		for (var i = 0; i < Snakey.boardSize; i++) {
			var row = [];
			for (var j = 0; j < Snakey.boardSize; j++) {
				row.push(null);
			}
			board.push(row);
		}
		
		return board;
	}
	
	Board.prototype.clearBoard = function () {
		for (var i = 0; i < Snakey.boardSize; i++) {
			for (var j = 0; j < Snakey.boardSize; j++) {
				if (this.board[i][j] == 'snake') {
					this.board[i][j] = null;
				};
			}
		}
	}
	
	return Board;
})();

Snakey.Game = (function () {
	function getRandomInt (min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	function Game () {
		this.board = new Snakey.Board();
		this.snake = new Snakey.Snake();
		this.points = 0;
	}
	
	Game.prototype.step = function () {
		this.snake.step();
		this.addApple();
		this.eatApple();
		this.board.update(this.snake);
	}
	
	Game.prototype.addApple = function() {
		var num = Math.random();
		var row = getRandomInt(0, 29);
		var col = getRandomInt(0, 29); 

		if (num > 0.95) {
			if (this.board.board[row][col] == null) {
				this.board.board[row][col] = 'apple';
			}
		}
	}
	
	Game.prototype.eatApple = function() {
		var snakeR = this.snake.head[0];
		var snakeC = this.snake.head[1];

		if (this.board.board[snakeR] && this.board.board[snakeR][snakeC] == 'apple') {
			this.points += 1;
			this.board.board[snakeR][snakeC] = 'snake';
			this.snake.embiggenSnake();
		};
	}
	
	return Game;
})();



