import Board from './board';
import Snake from './snake';
import Music from './music';

class Game {
  boardSize = null;
  board = null;
  snake = null;
  music = null;
  points = 0;
  paperPresent = false;

  constructor(boardSize = 30) {
    this.boardSize = boardSize;
    this.board = new Board(boardSize);
    this.snake = new Snake(boardSize);
    this.music = new Music();
  }
  
  step() {
    this.snake.step();
    this.addApple();
    this.eatApple();
    this.board.update(this.snake);
  }
  
  addApple() {
    const num = Math.random();
    const row = this.getRandomInt(0, 29);
    const col = this.getRandomInt(0, 29); 

    if (num > 0.96) {
      if (this.board.board[row][col] == null) {
        this.board.board[row][col] = 'apple';
      }
    }
  }
  
  eatApple() {
    const snakeR = this.snake.head[0];
    const snakeC = this.snake.head[1];

    if (this.board.board[snakeR] && this.board.board[snakeR][snakeC] == 'apple') {
      this.points += 1;
      this.board.board[snakeR][snakeC] = 'snake';
      this.snake.embiggenSnake();
      this.music.playNextSetOfNotes();
    };
  }
  
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

export default Game;