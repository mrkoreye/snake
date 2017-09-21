import Board from './board';
import Snake from './snake';

class Game {
  constructor(boardSize = 30) {
    this.boardSize = boardSize;
    this.board = new Board(boardSize);
    this.snake = new Snake(boardSize);
    this.points = 0;
  }
	
	step() {
		this.snake.step();
		this.addApple();
		this.eatApple();
		this.board.update(this.snake);
	}
	
	addApple() {
		var num = Math.random();
		var row = this.getRandomInt(0, 29);
		var col = this.getRandomInt(0, 29); 

		if (num > 0.96) {
			if (this.board.board[row][col] == null) {
				this.board.board[row][col] = 'apple';
			}
		}
	}
	
	eatApple() {
		var snakeR = this.snake.head[0];
		var snakeC = this.snake.head[1];

		if (this.board.board[snakeR] && this.board.board[snakeR][snakeC] == 'apple') {
			this.points += 1;
			this.board.board[snakeR][snakeC] = 'snake';
			this.snake.embiggenSnake();
		};
  }
  
  getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
};

export default Game;