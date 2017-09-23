import Board from './board';
import Snake from './snake';

class Game {
  boardSize = null;
  board = null;
  snake = null;
  music = null;
  points = 0;
  paperPresent = false;
  numApplesPresent = 0;

  constructor(boardSize = 30, music) {
    this.boardSize = boardSize;
    this.board = new Board(boardSize);
    this.snake = new Snake(boardSize);
    this.music = music;

    // Add a couple apples to get things started
    this.addApple(0);
    this.addApple(0);
  }
  
  step() {
    this.snake.step();
    this.addApple();
    this.eatApple();
    this.addPaper();
    this.eatPaper();
    this.board.update(this.snake);
  }
  
  addApple(probability = 0.96) {
    if (this.numApplesPresent < 4) {
      this.addRandomItem('apple', probability, () => this.numApplesPresent++);
    }
  }

  addPaper(probability = 0.998) {
    const snakeLength = this.snake.snake.length;
    const canAddPaper = (this.points > 10) && 
      !this.paperPresent && 
      (snakeLength > 30);

    if (canAddPaper) {
      const weightedProbability = probability - 0.0001 * snakeLength;
      this.addRandomItem('paper', weightedProbability, () => this.paperPresent = true);
    }
  }

  eatApple() {
    this.eatItem('apple', () => {
      this.points += 1;
      this.snake.embiggenSnake();
      this.music.playNextSetOfNotes();
      this.numApplesPresent--;

      if (this.numApplesPresent === 0) {
        this.addApple(0);
      }
    });
  }

  eatPaper() {
    this.eatItem('paper', () => {
      this.points += 5;
      this.snake.shrinkSnake();
      this.paperPresent = false;
      this.music.playNotes(['G3-Bb3-D3-a-t2']);
    });
  }

  addRandomItem(item, probability, onAdd) {
    const num = Math.random();
    const row = this.getRandomInt(0, 29);
    const col = this.getRandomInt(0, 29); 

    if (num > probability) {
      if (this.board.board[row][col] == null) {
        this.board.board[row][col] = item;
        onAdd();
      }
    }
  }

  eatItem(type, onEat) {
    const snakeR = this.snake.head[0];
    const snakeC = this.snake.head[1];

    if (this.board.board[snakeR] && this.board.board[snakeR][snakeC] === type) {
      this.board.board[snakeR][snakeC] = 'snake';
      onEat();
    };
  }
  
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

export default Game;