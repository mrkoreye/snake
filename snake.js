//var _ = require('./underscore')

Snakey = {};

Snakey.Snake = (function () {
	function Snake () {
		this.snake = [[5, 5], [5, 6], [5, 7], [5, 8], [5, 9]];
		this.head = _.last(this.snake);
		this.direction = "down";
	}
	
	Snake.prototype.turn = function (direction) {
		
		switch(direction) {
		case "left":
			if(!(this.direction == "right")) {
				this.direction = direction;
			}
			break;
		case "right":
			if(!(this.direction == "left")) {
				this.direction = direction;
			}
			break;
		case "up":
			if(!(this.direction == "down")) {
				this.direction = direction;
			}
			break;
		case "down":
			if(!(this.direction == "up")) {
				this.direction = direction;
			}
			break;
		}
	}
	
	Snake.prototype.step = function () {
		var newHead = [];
		
		switch(this.direction) {
		case "up":
			newHead[0] = this.head[0] - 1;
			newHead[1] = this.head[1];
			this.changeSnake(newHead);
			break;
		case "down":
			newHead[0] = this.head[0] + 1;
			newHead[1] = this.head[1];
			this.changeSnake(newHead);
			break;
		case "left":
			newHead[0] = this.head[0];
			newHead[1] = this.head[1] - 1;
			this.changeSnake(newHead);
			break;
		case "right":
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
		this.head = _.last(this.snake);
	}
	
	Snake.prototype.offBoard = function () {
		var min = _.min(this.head);
		var max = _.max(this.head);
		if(max > 29 || min < 0) {
			return true;
		} else {
			return false;
		}
	}
		
	Snake.prototype.biggerSnake = function () {
	    var last = _.first(this.snake);
      for (var i = 0; i < 2; i++) {
          this.snake.unshift([last[0] + i + 1, last[1]]);
      }
	}
	
	Snake.prototype.hitSelf = function () {
		for (var i = 0, len = this.snake.length; i < (len - 1); i++){
			if(this.head.toString() === this.snake[i].toString()){
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
		for(var i = 0, len = snake.snake.length; i < len; i ++) {
			var row = snake.snake[i][0];
			var col = snake.snake[i][1];
			this.board[row][col] = "snake";
		}
	}
	
	function createBoard () {
		var board = [];
		for (var i = 0; i < 30; i++) {
			var row = [];
			for(var j = 0; j < 30; j++) {
				row.push(null);
			}
			board.push(row);
		}
		
		return board;
	}
	
	Board.prototype.clearBoard = function () {
		for (var i = 0; i < 30; i++) {
			for(var j = 0; j < 30; j++) {
				if(this.board[i][j] == "snake") {
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
		// if(this.snake.hitSelf() || this.snake.offBoard()) {
// 			clearInterval(timer);
// 		};
		this.addApple();
		this.eatApple();
		this.board.update(this.snake);
		
	}
	
	Game.prototype.addApple = function() {
		var num = Math.random();
		var row = getRandomInt(0, 29);
		var col = getRandomInt(0, 29); 
		if(num > 0.95) {
			if(this.board.board[row][col] == null) {
				this.board.board[row][col] = "apple";
			}
		}
	}
	
	Game.prototype.eatApple = function() {
		var snakeR = this.snake.head[0];
		var snakeC = this.snake.head[1];
		if(this.board.board[snakeR][snakeC] == "apple") {
			this.points += 1;
			this.board.board[snakeR][snakeC] = "snake";
			this.snake.biggerSnake();
		};
	}
	
	return Game;
})();



