export class Board {
  board = this.createBoard();
  boardSize = null;

  constructor(boardSize) {
    this.boardSize = boardSize;
  }
  
  update(snake) {
    this.clearBoard();
    snake.snake.forEach((snakePiece) => {
      const row = snakePiece[0];
      const col = snakePiece[1];

      if (this.board[row]) {
        let value = 'snake';
        if (snake.head[0] === row && snake.head[1] === col) {
          value += ' head';
        }
        
        this.board[row][col] = value;
      }
    });
      
  }
  
  createBoard() {
    const board = new Array(this.boardSize).fill(null);
    return board.map((el) => new Array(this.boardSize).fill(null));
  }
  
  clearBoard() {
    this.board = this.createBoard();
  }
}

export default Board;